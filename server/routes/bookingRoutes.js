/*----- FILE: bookingRoutes.js | CONTENT: Routes for theatres, shows, occupied seats, and customer bookings. | PURPOSE: Maps booking API URLs to controller functions and protects booking data with JWT authentication. -----*/

const express = require("express");
const {
  getTheatres,
  getShows,
  getOccupiedSeats,
  createBooking,
  getMyBookings,
} = require("../controllers/bookingController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

/*----- PUBLIC BOOKING DATA: Theatre and show schedules can be read by the booking page. -----*/
router.get("/theatres", getTheatres);
router.get("/shows", getShows);

/*----- PROTECTED BOOKING DATA: Only logged-in users can see occupied seats, create bookings, or view their booking history. -----*/
router.get("/occupied-seats", authenticate, getOccupiedSeats);
router.post("/bookings", authenticate, createBooking);
router.get("/my-bookings", authenticate, getMyBookings);

module.exports = router;
