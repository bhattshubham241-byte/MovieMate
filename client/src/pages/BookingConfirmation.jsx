/*----- FILE: BookingConfirmation.jsx | CONTENT: Successful booking confirmation page. | PURPOSE: Displays the booking reference and final ticket details after the demo payment step. -----*/

import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Ticket } from "lucide-react";

import "../styles/confirmation.css";

function BookingConfirmation() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <main className="confirmation-page">
        <div className="confirmation-card">
          <h1>Booking Not Found</h1>
          <Link to="/movies">Browse Movies</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="confirmation-page">
      <section className="confirmation-card">
        {/*----- ----- SUCCESS ICON ----- -----*/}
        <CheckCircle className="confirmation-icon" size={64} />

        <p className="confirmation-label">BOOKING CONFIRMED</p>
        <h1>Enjoy Your Movie!</h1>
        <p>Your MovieMate ticket has been booked successfully.</p>

        {/*----- ----- BOOKING DETAILS ----- -----*/}
        <div className="confirmation-details">
          <div><span>Booking ID</span><strong>{booking.bookingReference}</strong></div>
          <div><span>Movie</span><strong>{booking.movie?.title}</strong></div>
          <div><span>Date & Time</span><strong>{new Date(booking.date).toLocaleDateString("en-IN")} • {booking.show?.time}</strong></div>
          <div><span>Theatre</span><strong>{booking.theatre?.name}</strong></div>
          <div><span>Seats</span><strong>{booking.seats?.join(", ")}</strong></div>
          <div><span>Total Paid</span><strong>₹{booking.totalAmount}</strong></div>
        </div>

        <div className="confirmation-actions">
          <Link to="/my-bookings" className="confirmation-primary">
            <Ticket size={18} />
            My Bookings
          </Link>
          <Link to="/movies" className="confirmation-secondary">
            Browse More Movies
          </Link>
        </div>
      </section>
    </main>
  );
}

export default BookingConfirmation;
