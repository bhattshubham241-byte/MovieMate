/*----- FILE: bookingController.js | CONTENT: Theatre, show, seat-availability, and booking controller functions. | PURPOSE: Provides the backend logic required to display shows, check occupied seats, create bookings, and retrieve a user's booking history. -----*/

const crypto = require("crypto");
const mongoose = require("mongoose");
const Theatre = require("../models/Theatre");
const Show = require("../models/Show");
const Booking = require("../models/Booking");
const Movie = require("../models/movie");

/*----- GET THEATRES: Returns all theatres stored in MongoDB. -----*/
const getTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find().sort({ name: 1 });
    res.status(200).json(theatres);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch theatres", error: error.message });
  }
};

/*----- GET SHOWS: Returns shows for a movie on the requested date. -----*/
const getShows = async (req, res) => {
  try {
    const { movieId, date } = req.query;

    if (!movieId || !date) {
      return res.status(400).json({ message: "movieId and date are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const start = new Date(`${date}T00:00:00`);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const shows = await Show.find({
      movie: movieId,
      date: { $gte: start, $lt: end },
    })
      .populate("theatre")
      .sort({ "theatre.name": 1, time: 1 });

    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch shows", error: error.message });
  }
};

/*----- GET OCCUPIED SEATS: Finds seats already used by confirmed bookings for one show. -----*/
const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.query;

    if (!showId || !mongoose.Types.ObjectId.isValid(showId)) {
      return res.status(400).json({ message: "Valid showId is required" });
    }

    const bookings = await Booking.find({
      show: showId,
      status: "confirmed",
    }).select("seats -_id");

    const occupiedSeats = bookings.flatMap((booking) => booking.seats);

    res.status(200).json({ occupiedSeats });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch occupied seats", error: error.message });
  }
};

/*----- CREATE BOOKING: Validates the show, checks seats, and saves the confirmed booking in MongoDB. -----*/
const createBooking = async (req, res) => {
  try {
    const { showId, seats, convenienceFee = 30 } = req.body;

    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: "showId and at least one seat are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(showId)) {
      return res.status(400).json({ message: "Invalid show ID" });
    }

    const uniqueSeats = [...new Set(seats.map((seat) => String(seat).toUpperCase()))];

    if (uniqueSeats.length !== seats.length) {
      return res.status(400).json({ message: "Duplicate seats are not allowed" });
    }

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    const movie = await Movie.findById(show.movie);
    if (!movie) {
      return res.status(404).json({ message: "Movie configuration not found" });
    }

    /*----- SEAT VALIDATION: Ensures every selected seat exists in the administrator-configured layout. -----*/
    const rows = movie.seating?.rows?.length ? movie.seating.rows : ["A", "B", "C", "D", "E", "F"];
    const seatsPerRow = movie.seating?.seatsPerRow || 8;
    const validSeats = new Set(rows.flatMap((row) => Array.from({ length: seatsPerRow }, (_, index) => `${row}${index + 1}`)));
    const invalidSeats = uniqueSeats.filter((seat) => !validSeats.has(seat));
    if (invalidSeats.length) {
      return res.status(400).json({ message: `Invalid seat(s): ${invalidSeats.join(", ")}` });
    }

    /*----- CATEGORY PRICING: Finds the configured ticket category for every selected seat. -----*/
    const categories = movie.seating?.categories?.length ? movie.seating.categories : [
      { name: "Silver", rows: ["A", "B"], price: 150 },
      { name: "Gold", rows: ["C", "D"], price: 200 },
      { name: "Platinum", rows: ["E", "F"], price: 250 },
    ];
    const seatDetails = uniqueSeats.map((seat) => {
      const row = seat.match(/^[A-Z]+/)?.[0];
      const category = categories.find((item) => item.rows.includes(row));
      if (!category) throw new Error(`No ticket category configured for row ${row}`);
      return { seat, category: category.name, price: Number(category.price) };
    });
    const ticketTotal = seatDetails.reduce((sum, item) => sum + item.price, 0);

    /*----- OCCUPIED-SEAT CHECK: Prevents a user from booking a seat already reserved for this show. -----*/
    const existingBooking = await Booking.findOne({
      show: showId,
      seats: { $in: uniqueSeats },
      status: "confirmed",
    });

    if (existingBooking) {
      const occupied = existingBooking.seats.filter((seat) => uniqueSeats.includes(seat));
      return res.status(409).json({
        message: "One or more selected seats are already booked",
        occupiedSeats: occupied,
      });
    }

    const totalAmount = ticketTotal + Number(convenienceFee);
    const bookingReference = `MM-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    /*----- SAVE BOOKING: MongoDB becomes the source of truth for booked seats. -----*/
    const booking = await Booking.create({
      user: req.userId,
      movie: show.movie,
      theatre: show.theatre,
      show: show._id,
      date: show.date,
      seats: uniqueSeats,
      ticketPrice: ticketTotal,
      seatDetails,
      convenienceFee: Number(convenienceFee),
      totalAmount,
      bookingReference,
      status: "confirmed",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("movie", "title poster language duration rating")
      .populate("theatre", "name location city")
      .populate("show", "time screen price")
      .populate("user", "name email");

    res.status(201).json({
      message: "Booking confirmed successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    /*----- DUPLICATE KEY HANDLING: Handles a race where another user books the same seat at almost the same time. -----*/
    if (error.code === 11000) {
      return res.status(409).json({
        message: "One or more selected seats were just booked by another user. Please choose different seats.",
      });
    }

    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
};

/*----- GET MY BOOKINGS: Returns only the bookings belonging to the logged-in user. -----*/
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("movie", "title poster language duration rating")
      .populate("theatre", "name location city")
      .populate("show", "time screen price")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};

module.exports = {
  getTheatres,
  getShows,
  getOccupiedSeats,
  createBooking,
  getMyBookings,
};
