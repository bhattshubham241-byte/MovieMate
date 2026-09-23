/*----- FILE: BookingSummary.jsx | CONTENT: Booking summary page. Combines movie, theatre, date, show time, seats, and price information. -----*/

import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  Clock,
  Armchair,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import api from "../services/api";

import "../styles/bookingSummary.css";

function BookingSummary() {
  const { movieId } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const {
    selectedDate,
    selectedShow,
    selectedSeats,
  } = location.state || {};

  const [movie, setMovie] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const convenienceFee = 30;
  const ticketTotal = Number(location.state?.ticketTotal) || (selectedSeats?.length || 0) * (selectedShow?.price || 200);
  const totalAmount = ticketTotal + convenienceFee;


  useEffect(() => {

    const fetchMovie = async () => {

      try {

        const response =
          await api.get(`/movies/${movieId}`);

        setMovie(response.data);

      } catch (error) {

        console.error(
          "Failed to fetch movie:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    fetchMovie();

  }, [movieId]);


  if (loading) {

    return (
      <main className="summary-page">

        <div className="summary-loading">
          Loading booking summary...
        </div>

      </main>
    );
  }


  if (!movie) {

    return (
      <main className="summary-page">

        <div className="summary-loading">
          Movie not found.
        </div>

      </main>
    );
  }


  return (
    <main className="summary-page">

      {/*----- Header -----*/}
      <section className="summary-header">

        <p className="summary-label">
          REVIEW YOUR BOOKING
        </p>

        <h1>
          Booking Summary
        </h1>

        <p>
          Check your booking details before
          proceeding to payment.
        </p>

      </section>


      {/*----- Main Content -----*/}
      <section className="summary-container">


        {/*----- Movie Card -----*/}
        <div className="summary-movie-card">

          <img
            src={movie.poster}
            alt={movie.title}
          />

          <div className="summary-movie-info">

            <p className="summary-movie-label">
              MOVIE
            </p>

            <h2>
              {movie.title}
            </h2>

            <div className="summary-rating">
              ⭐ {movie.rating}
            </div>

            <p>
              {movie.language}
              {" • "}
              {movie.duration}
            </p>

          </div>

        </div>


        {/*----- Booking Details -----*/}
        <div className="summary-details">

          <h2>
            Booking Details
          </h2>


          {/*----- Theatre -----*/}
          <div className="summary-detail-item">

            <div className="summary-icon">
              <MapPin size={20} />
            </div>

            <div>

              <span>
                Theatre
              </span>

              <strong>
                {selectedShow?.theatreName ||
                  "Not selected"}
              </strong>

              <p>
                {selectedShow?.location}
                {selectedShow?.location &&
                  ", "}
                {selectedShow?.city}
              </p>

            </div>

          </div>


          {/*----- Date -----*/}
          <div className="summary-detail-item">

            <div className="summary-icon">
              <CalendarDays size={20} />
            </div>

            <div>

              <span>
                Date
              </span>

              <strong>
                {selectedDate ||
                  "Not selected"}
              </strong>

            </div>

          </div>


          {/*----- Show -----*/}
          <div className="summary-detail-item">

            <div className="summary-icon">
              <Clock size={20} />
            </div>

            <div>

              <span>
                Show Time
              </span>

              <strong>
                {selectedShow?.showTime ||
                  "Not selected"}
              </strong>

            </div>

          </div>


          {/*----- Seats -----*/}
          <div className="summary-detail-item">

            <div className="summary-icon">
              <Armchair size={20} />
            </div>

            <div>

              <span>
                Selected Seats
              </span>

              <strong>
                {selectedSeats?.join(", ") ||
                  "No seats selected"}
              </strong>

            </div>

          </div>

        </div>


        {/*----- Price -----*/}
        <div className="price-card">

          <h2>
            Price Details
          </h2>


          <div className="price-row">

            <span>
              Tickets (
              {selectedSeats?.length || 0}
              )
            </span>

            <span>
              ₹{ticketTotal}
            </span>

          </div>


          <div className="price-row">

            <span>
              Convenience Fee
            </span>

            <span>
              ₹{convenienceFee}
            </span>

          </div>


          <div className="price-divider"></div>


          <div className="price-total">

            <span>
              Total Amount
            </span>

            <strong>
              ₹{totalAmount}
            </strong>

          </div>


          <button
            className="payment-button"
            disabled={
              !selectedSeats ||
              selectedSeats.length === 0
            }
            onClick={() =>
              navigate(`/payment/${movieId}`, {
                state: {
                  movie,
                  selectedDate,
                  selectedShow,
                  selectedSeats,
                  totalAmount,
                },
              })
            }
          >
            <CreditCard size={18} />

            Proceed to Payment →
          </button>

        </div>

      </section>


      {/*----- Back -----*/}
      <div className="summary-back">

        <button
          onClick={() =>
            navigate(-1)
          }
        >
          <ArrowLeft size={17} />

          Back to Seat Selection
        </button>

      </div>

    </main>
  );
}

export default BookingSummary;