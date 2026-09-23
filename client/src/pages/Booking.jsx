/*----- FILE: Booking.jsx | CONTENT: Dynamic theatre and show selection page. | PURPOSE: Lets a logged-in user choose a valid date, theatre, and show fetched from MongoDB. -----*/

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Clock, CalendarDays } from "lucide-react";

import api from "../services/api";
import "../styles/booking.css";

/*----- DATE FORMATTER: Converts a Date object into YYYY-MM-DD for API requests. -----*/
const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/*----- DATE DISPLAY: Creates a user-friendly label without hard-coding calendar dates. -----*/
const getDateLabel = (date, index) => {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

/*----- TIME CONVERTER: Converts a 12-hour show time into minutes after midnight. -----*/
const timeToMinutes = (time) => {
  const [clock, period] = time.split(" ");
  let [hours, minutes] = clock.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

function Booking() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShow, setSelectedShow] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*----- DYNAMIC DATES: Generates the next 7 calendar dates beginning with today's date. Past dates are never included. -----*/
  const dates = useMemo(() => {
    const result = [];
    const today = new Date();

    for (let index = 0; index < 7; index += 1) {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(today.getDate() + index);

      result.push({
        value: toDateString(date),
        label: getDateLabel(date, index),
        fullDate: date,
      });
    }

    return result;
  }, []);

  /*----- DEFAULT DATE: Automatically selects today's date whenever the booking page opens. -----*/
  useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0].value);
    }
  }, [dates, selectedDate]);

  /*----- FETCH SHOWS: Gets shows for the selected movie and valid date from the Express API. -----*/
  useEffect(() => {
    const fetchShows = async () => {
      if (!selectedDate) return;

      setLoading(true);
      setError("");
      setSelectedShow(null);

      try {
        const response = await api.get("/booking/shows", {
          params: {
            movieId,
            date: selectedDate,
          },
        });

        setShows(response.data);
      } catch (requestError) {
        console.error("Failed to fetch shows:", requestError);
        setShows([]);
        setError("Unable to load shows. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [movieId, selectedDate]);

  /*----- TODAY FILTER: On today's date, hides show times that have already passed. Future dates show all scheduled times. -----*/
  const availableShows = useMemo(() => {
    const todayString = toDateString(new Date());
    const isToday = selectedDate === todayString;

    if (!isToday) return shows;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return shows.filter(
      (show) => timeToMinutes(show.time) > currentMinutes
    );
  }, [shows, selectedDate]);

  /*----- SHOW SELECTION: Stores the selected show and populated theatre information. -----*/
  const handleShowSelect = (show) => {
    setSelectedShow({
      showId: show._id,
      theatreId: show.theatre._id,
      theatreName: show.theatre.name,
      location: show.theatre.location,
      city: show.theatre.city,
      showTime: show.time,
      screen: show.screen,
      price: show.price,
    });
  };

  /*----- CONTINUE: Sends the selected date and show to the seat-selection page. -----*/
  const handleContinue = () => {
    if (!selectedShow) return;

    navigate(`/seat-selection/${movieId}`, {
      state: {
        selectedDate,
        selectedShow,
      },
    });
  };

  return (
    <main className="booking-page">
      {/*----- HEADER: Explains the purpose of the booking page. -----*/}
      <section className="booking-header">
        <p className="booking-label">BOOK YOUR TICKETS</p>
        <h1>Select Theatre & Show</h1>
        <p>Choose your preferred theatre, date and show time.</p>
      </section>

      {/*----- DATE SELECTION: Dates are generated dynamically from today's date. -----*/}
      <section className="booking-section">
        <div className="booking-section-title">
          <CalendarDays size={20} />
          <h2>Select Date</h2>
        </div>

        <div className="date-list">
          {dates.map((date) => (
            <button
              key={date.value}
              className={`date-button ${selectedDate === date.value ? "active" : ""}`}
              onClick={() => setSelectedDate(date.value)}
            >
              <strong>{date.label}</strong>
              <span>
                {date.fullDate.toLocaleDateString("en-IN", {
                  weekday: "short",
                })}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/*----- SHOW LIST: Displays theatre and show information received from MongoDB. -----*/}
      <section className="booking-section">
        <div className="booking-section-title">
          <MapPin size={20} />
          <h2>Available Theatres</h2>
        </div>

        {loading && <p className="booking-message">Loading available shows...</p>}
        {error && <p className="booking-message error">{error}</p>}

        {!loading && !error && availableShows.length === 0 && (
          <p className="booking-message">
            No more shows are available for this date.
          </p>
        )}

        {!loading && !error && availableShows.length > 0 && (
          <div className="theatre-list">
            {Object.values(
              availableShows.reduce((groups, show) => {
                const theatreId = show.theatre._id;

                if (!groups[theatreId]) {
                  groups[theatreId] = {
                    theatre: show.theatre,
                    shows: [],
                  };
                }

                groups[theatreId].shows.push(show);
                return groups;
              }, {})
            ).map((group) => (
              <div className="theatre-card" key={group.theatre._id}>
                {/*----- THEATRE INFORMATION: Displays theatre name and location. -----*/}
                <div className="theatre-info">
                  <h3>{group.theatre.name}</h3>
                  <p>
                    <MapPin size={15} />
                    {group.theatre.location}, {group.theatre.city}
                  </p>
                </div>

                {/*----- SHOW TIMES: Displays available show buttons for the theatre. -----*/}
                <div className="show-times">
                  <p className="show-title">
                    <Clock size={15} />
                    Show Times
                  </p>

                  <div className="show-buttons">
                    {group.shows.map((show) => {
                      const isSelected = selectedShow?.showId === show._id;

                      return (
                        <button
                          key={show._id}
                          className={`show-button ${isSelected ? "active" : ""}`}
                          onClick={() => handleShowSelect(show)}
                        >
                          {show.time}
                          <small>₹{show.price}</small>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/*----- CONTINUE BUTTON: Enabled only after a valid show has been selected. -----*/}
      <div className="booking-footer">
        <button
          className="continue-button"
          disabled={!selectedShow}
          onClick={handleContinue}
        >
          Continue to Seat Selection →
        </button>
      </div>
    </main>
  );
}

export default Booking;
