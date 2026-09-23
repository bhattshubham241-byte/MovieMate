/*----- FILE: MyBookings.jsx | CONTENT: Authenticated user's booking history page. | PURPOSE: Retrieves confirmed bookings from MongoDB for the currently logged-in MovieMate user. -----*/

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";

import api from "../services/api";
import "../styles/myBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*----- FETCH BOOKINGS: Loads only the authenticated user's bookings from the protected API. -----*/
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/booking/my-bookings");
        setBookings(response.data);
      } catch (requestError) {
        console.error("Failed to fetch bookings:", requestError);
        setError("Unable to load your bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <main className="my-bookings-page">
      <section className="my-bookings-header">
        <p className="my-bookings-label">YOUR BOOKINGS</p>
        <h1>My Bookings</h1>
        <p>View your confirmed MovieMate tickets stored in MongoDB.</p>
      </section>

      {loading && <div className="empty-bookings"><p>Loading bookings...</p></div>}
      {error && <div className="empty-bookings"><p>{error}</p></div>}

      {!loading && !error && bookings.length === 0 && (
        <div className="empty-bookings">
          <Ticket size={42} />
          <h2>No bookings yet</h2>
          <p>Book a movie and your confirmed ticket will appear here.</p>
          <Link to="/movies">Browse Movies</Link>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <section className="booking-history">
          {bookings.map((booking) => (
            <article className="history-card" key={booking._id}>
              <div>
                <p className="history-label">MOVIE</p>
                <h2>{booking.movie?.title}</h2>
                <p>{booking.theatre?.name}</p>
                <p>{booking.theatre?.location}, {booking.theatre?.city}</p>
              </div>
              <div className="history-info">
                <span>{new Date(booking.date).toLocaleDateString("en-IN")}</span>
                <span>{booking.show?.time}</span>
                <span>Seats: {booking.seats.join(", ")}</span>
                <span>Booking ID: {booking.bookingReference}</span>
                <strong>₹{booking.totalAmount}</strong>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default MyBookings;
