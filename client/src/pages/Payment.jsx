/*----- FILE: Payment.jsx | CONTENT: Demo payment and booking-confirmation page. | PURPOSE: Collects demonstration payment fields and creates the final ticket booking in MongoDB after payment submission. -----*/

import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CreditCard, ArrowLeft } from "lucide-react";

import api from "../services/api";
import "../styles/payment.css";

function Payment() {
  const { movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state || {};

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  /*----- PAYMENT VALIDATION: These fields are demonstration fields only; no real card information is sent to a payment gateway. -----*/
  const handlePayment = async (event) => {
    event.preventDefault();
    setError("");
    setProcessing(true);

    try {
      /*----- CREATE BOOKING: The backend checks the latest seat availability before saving the booking. -----*/
      const response = await api.post("/booking/bookings", {
        showId: booking.selectedShow?.showId,
        seats: booking.selectedSeats,
        convenienceFee: 30,
      });

      navigate("/booking-confirmation", {
        state: { booking: response.data.booking },
      });
    } catch (requestError) {
      console.error("Booking failed:", requestError);

      if (requestError.response?.status === 409) {
        setError(
          requestError.response.data.message ||
            "One or more selected seats are already booked. Please go back and select different seats."
        );
      } else {
        setError("Booking could not be completed. Please try again.");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="payment-page">
      <section className="payment-header">
        <p className="payment-label">PAYMENT</p>
        <h1>Complete Your Booking</h1>
        <p>Enter demo payment details to confirm your MovieMate ticket.</p>
      </section>

      {error && <p className="payment-error">{error}</p>}

      <section className="payment-container">
        {/*----- BOOKING INFORMATION: Displays the order that will be confirmed. -----*/}
        <div className="payment-booking-card">
          <h2>{booking.movie?.title || "Movie Booking"}</h2>
          <p>{booking.selectedShow?.theatreName || "Theatre not selected"}</p>
          <p>{booking.selectedDate || "Date not selected"} • {booking.selectedShow?.showTime || "Time not selected"}</p>
          <p>Seats: {booking.selectedSeats?.join(", ") || "None"}</p>
          <strong>Total: ₹{booking.totalAmount || 0}</strong>
        </div>

        <form className="payment-form" onSubmit={handlePayment}>
          <h2>Demo Card Details</h2>

          <label htmlFor="cardNumber">Card Number</label>
          <input id="cardNumber" value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} placeholder="1234 5678 9012 3456" maxLength="19" required />

          <label htmlFor="cardName">Card Holder Name</label>
          <input id="cardName" value={cardName} onChange={(event) => setCardName(event.target.value)} placeholder="Enter card holder name" required />

          <div className="payment-small-fields">
            <div>
              <label htmlFor="expiry">Expiry</label>
              <input id="expiry" value={expiry} onChange={(event) => setExpiry(event.target.value)} placeholder="MM/YY" required />
            </div>
            <div>
              <label htmlFor="cvv">CVV</label>
              <input id="cvv" value={cvv} onChange={(event) => setCvv(event.target.value)} placeholder="123" maxLength="4" required />
            </div>
          </div>

          <button className="pay-now-button" type="submit" disabled={processing}>
            <CreditCard size={18} />
            {processing ? "Processing..." : `Pay ₹${booking.totalAmount || 0}`}
          </button>

          <button className="payment-back-button" type="button" onClick={() => navigate(-1)} disabled={processing}>
            <ArrowLeft size={17} />
            Back to Summary
          </button>
        </form>
      </section>
    </main>
  );
}

export default Payment;
