/*----- FILE: SeatSelection.jsx | CONTENT: Dynamic seat selection page. | PURPOSE: Builds the seat map from the movie configuration, displays ticket categories, and blocks seats already booked for the selected show. -----*/

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Armchair } from "lucide-react";
import api from "../services/api";
import "../styles/seatSelection.css";

const fallbackSeating = { rows: ["A", "B", "C", "D", "E", "F"], seatsPerRow: 8, categories: [{ name: "Silver", rows: ["A", "B"], price: 150 }, { name: "Gold", rows: ["C", "D"], price: 200 }, { name: "Platinum", rows: ["E", "F"], price: 250 }] };

function SeatSelection() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDate, selectedShow } = location.state || {};
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedShow?.showId) { setError("Show information is missing. Please select the show again."); setLoading(false); return; }
      try {
        const [movieResponse, seatResponse] = await Promise.all([
          api.get(`/movies/${movieId}`),
          api.get("/booking/occupied-seats", { params: { showId: selectedShow.showId } }),
        ]);
        setMovie(movieResponse.data);
        setOccupiedSeats(seatResponse.data.occupiedSeats || []);
      } catch (requestError) { setError(requestError.response?.data?.message || "Unable to load seat availability."); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [movieId, selectedShow?.showId]);

  const seating = movie?.seating || fallbackSeating;
  const rows = seating.rows?.length ? seating.rows : fallbackSeating.rows;
  const seatsPerRow = seating.seatsPerRow || 8;
  const categories = seating.categories?.length ? seating.categories : fallbackSeating.categories;

  const getCategory = (row) => categories.find((category) => category.rows.includes(row)) || { name: "General", price: selectedShow?.price || 200 };

  const ticketTotal = useMemo(() => selectedSeats.reduce((sum, seat) => sum + Number(getCategory(seat.match(/^[A-Z]+/)?.[0]).price), 0), [selectedSeats, categories, selectedShow?.price]);

  const toggleSeat = (seat) => {
    if (occupiedSeats.includes(seat)) return;
    setSelectedSeats((previous) => previous.includes(seat) ? previous.filter((item) => item !== seat) : [...previous, seat]);
  };

  const handleContinue = () => {
    if (!selectedSeats.length || !selectedShow?.showId) return;
    navigate(`/booking-summary/${movieId}`, { state: { movie, selectedDate, selectedShow, selectedSeats, ticketTotal } });
  };

  return (
    <main className="seat-page">
      <section className="seat-header"><p className="seat-label">SELECT YOUR SEATS</p><h1>Choose Your Seats</h1><p>{movie?.title || "Movie"} • {selectedShow?.theatreName || "Theatre"} • {selectedShow?.showTime || "Show"}</p></section>
      {error && <p className="seat-message error">{error}</p>}
      {loading ? <p className="seat-message">Loading seat availability...</p> : <section className="seat-layout">
        <div className="screen-container"><div className="screen">SCREEN</div></div>
        <div className="seats-container">
          {rows.map((row) => <div className="seat-row" key={row}><span className="row-label">{row}</span><div className="seats">{Array.from({ length: seatsPerRow }, (_, index) => {
            const seatId = `${row}${index + 1}`; const category = getCategory(row); const isSelected = selectedSeats.includes(seatId); const isOccupied = occupiedSeats.includes(seatId);
            return <button key={seatId} type="button" className={`seat ${isSelected ? "selected" : ""} ${isOccupied ? "occupied" : ""}`} disabled={isOccupied} title={`${category.name} • ₹${category.price}`} onClick={() => toggleSeat(seatId)}><Armchair size={18} /><span>{index + 1}</span></button>;
          })}</div><span className="row-category">{getCategory(row).name}<small>₹{getCategory(row).price}</small></span></div>)}
        </div>
        <div className="seat-category-legend">{categories.map((category) => <div key={category.name}><span></span><strong>{category.name}</strong> ₹{category.price} <small>({category.rows.join(", ")})</small></div>)}</div>
        <div className="seat-legend"><div><span className="legend-seat available"></span>Available</div><div><span className="legend-seat selected"></span>Selected</div><div><span className="legend-seat occupied"></span>Occupied</div></div>
      </section>}
      <section className="seat-summary"><div><p>Selected Seats</p><h3>{selectedSeats.length ? selectedSeats.join(", ") : "No seats selected"}</h3></div><div className="seat-count"><span>{selectedSeats.length} {selectedSeats.length === 1 ? "Seat" : "Seats"}</span><strong>₹{ticketTotal}</strong></div><button className="proceed-button" disabled={!selectedSeats.length || loading || Boolean(error)} onClick={handleContinue}>Continue →</button></section>
    </main>
  );
}

export default SeatSelection;
