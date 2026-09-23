/*----- FILE: Booking.js | CONTENT: Defines the Booking schema and MongoDB model. | PURPOSE: Stores completed MovieMate ticket bookings and prevents the same seat from being booked twice for the same show. -----*/

const mongoose = require("mongoose");

/*----- BOOKING SCHEMA: Stores the user, show, seats, amount, and booking status for each confirmed ticket order. -----*/
const bookingSchema = new mongoose.Schema(
  {
    /*----- USER: Identifies the customer who made the booking. -----*/
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /*----- MOVIE: Stores the movie reference for easy booking-history display. -----*/
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    /*----- THEATRE: Stores the selected theatre reference. -----*/
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true,
    },

    /*----- SHOW: A booking belongs to one particular show. -----*/
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },

    /*----- DATE: Stores the calendar date of the selected show. -----*/
    date: {
      type: Date,
      required: true,
    },

    /*----- SEATS: Contains seat IDs such as A1, A2, and B4. -----*/
    seats: {
      type: [String],
      required: true,
      validate: {
        validator: (seats) => seats.length > 0 && new Set(seats).size === seats.length,
        message: "At least one unique seat is required",
      },
    },

    /*----- TICKET PRICE: Price for one seat at the selected show. -----*/
    ticketPrice: {
      type: Number,
      required: true,
    },

    /*----- SEAT DETAILS: Stores the ticket category and price used for every booked seat. -----*/
    seatDetails: {
      type: [{
        _id: false,
        seat: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
      }],
      default: [],
    },

    /*----- CONVENIENCE FEE: Fixed booking convenience fee used by MovieMate. -----*/
    convenienceFee: {
      type: Number,
      default: 30,
    },

    /*----- TOTAL AMOUNT: Final amount paid for this booking. -----*/
    totalAmount: {
      type: Number,
      required: true,
    },

    /*----- BOOKING REFERENCE: Human-readable unique booking number shown to the customer. -----*/
    bookingReference: {
      type: String,
      required: true,
      unique: true,
    },

    /*----- STATUS: Tracks whether the booking is confirmed or cancelled. -----*/
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

/*----- UNIQUE SEAT INDEX: The same seat can be booked only once for one show. A different show can use the same seat. -----*/
bookingSchema.index({ show: 1, seats: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
