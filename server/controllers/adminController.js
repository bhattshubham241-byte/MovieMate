/*----- FILE: adminController.js | CONTENT: Administration controller functions. | PURPOSE: Provides dashboard statistics and complete CRUD operations for movies, theatres, and shows. -----*/

const Movie = require("../models/movie");
const Theatre = require("../models/Theatre");
const Show = require("../models/Show");
const Booking = require("../models/Booking");
const User = require("../models/User");

const normalizeMoviePayload = (body) => ({
  ...body,
  genre: Array.isArray(body.genre) ? body.genre : String(body.genre || "").split(",").map((x) => x.trim()).filter(Boolean),
  rating: Number(body.rating) || 0,
  seating: {
    rows: String(body.seating?.rows || "A-F").split(",").map((x) => x.trim()).filter(Boolean),
    seatsPerRow: Number(body.seating?.seatsPerRow) || 8,
    categories: Array.isArray(body.seating?.categories) ? body.seating.categories.map((category) => ({
      name: String(category.name || "").trim(),
      rows: Array.isArray(category.rows) ? category.rows : String(category.rows || "").split(",").map((x) => x.trim()).filter(Boolean),
      price: Number(category.price) || 0,
    })) : [],
  },
});

/*----- DASHBOARD: Returns counts and booking revenue for the admin dashboard. -----*/
const getDashboard = async (req, res) => {
  try {
    const [movies, theatres, shows, users, bookings, revenueResult] = await Promise.all([
      Movie.countDocuments(), Theatre.countDocuments(), Show.countDocuments(), User.countDocuments(), Booking.countDocuments({ status: "confirmed" }),
      Booking.aggregate([{ $match: { status: "confirmed" } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
    ]);
    res.json({ movies, theatres, shows, users, bookings, revenue: revenueResult[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard", error: error.message });
  }
};

/*----- LIST DATA: Returns all entities used by the admin management tables. -----*/
const getAdminData = async (req, res) => {
  try {
    const [movies, theatres, shows] = await Promise.all([
      Movie.find().sort({ createdAt: -1 }),
      Theatre.find().sort({ name: 1 }),
      Show.find().populate("movie", "title").populate("theatre", "name location city").sort({ date: 1, time: 1 }),
    ]);
    res.json({ movies, theatres, shows });
  } catch (error) {
    res.status(500).json({ message: "Failed to load admin data", error: error.message });
  }
};

/*----- CREATE MOVIE: Inserts a movie with its seating layout and ticket categories. -----*/
const createMovie = async (req, res) => {
  try { res.status(201).json(await Movie.create(normalizeMoviePayload(req.body))); }
  catch (error) { res.status(400).json({ message: "Failed to create movie", error: error.message }); }
};

/*----- UPDATE MOVIE: Updates movie information and seating configuration. -----*/
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, normalizeMoviePayload(req.body), { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) { res.status(400).json({ message: "Failed to update movie", error: error.message }); }
};

/*----- DELETE MOVIE: Removes a movie only when it has no scheduled shows or bookings. -----*/
const deleteMovie = async (req, res) => {
  try {
    const showCount = await Show.countDocuments({ movie: req.params.id });
    if (showCount) return res.status(409).json({ message: "Delete the movie's shows first." });
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted successfully" });
  } catch (error) { res.status(400).json({ message: "Failed to delete movie", error: error.message }); }
};

/*----- CREATE THEATRE: Inserts theatre information. -----*/
const createTheatre = async (req, res) => {
  try { res.status(201).json(await Theatre.create(req.body)); }
  catch (error) { res.status(400).json({ message: "Failed to create theatre", error: error.message }); }
};

/*----- UPDATE THEATRE: Updates theatre information. -----*/
const updateTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!theatre) return res.status(404).json({ message: "Theatre not found" });
    res.json(theatre);
  } catch (error) { res.status(400).json({ message: "Failed to update theatre", error: error.message }); }
};

/*----- DELETE THEATRE: Prevents deletion while shows still reference the theatre. -----*/
const deleteTheatre = async (req, res) => {
  try {
    const showCount = await Show.countDocuments({ theatre: req.params.id });
    if (showCount) return res.status(409).json({ message: "Delete the theatre's shows first." });
    const theatre = await Theatre.findByIdAndDelete(req.params.id);
    if (!theatre) return res.status(404).json({ message: "Theatre not found" });
    res.json({ message: "Theatre deleted successfully" });
  } catch (error) { res.status(400).json({ message: "Failed to delete theatre", error: error.message }); }
};

/*----- CREATE SHOW: Creates a scheduled show. -----*/
const createShow = async (req, res) => {
  try {
    const { movie, theatre, date, time, screen, price } = req.body;
    if (!movie || !theatre || !date || !time) return res.status(400).json({ message: "Movie, theatre, date and time are required" });
    const show = await Show.create({ movie, theatre, date: new Date(`${date}T00:00:00`), time, screen: Number(screen) || 1, price: Number(price) || 200 });
    res.status(201).json(await Show.findById(show._id).populate("movie").populate("theatre"));
  } catch (error) { res.status(400).json({ message: "Failed to create show", error: error.message }); }
};

/*----- UPDATE SHOW: Updates a scheduled show. -----*/
const updateShow = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.date) data.date = new Date(`${data.date}T00:00:00`);
    if (data.screen !== undefined) data.screen = Number(data.screen);
    if (data.price !== undefined) data.price = Number(data.price);
    const show = await Show.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).populate("movie").populate("theatre");
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (error) { res.status(400).json({ message: "Failed to update show", error: error.message }); }
};

/*----- DELETE SHOW: Deletes a show only when it has no confirmed bookings. -----*/
const deleteShow = async (req, res) => {
  try {
    const bookingCount = await Booking.countDocuments({ show: req.params.id, status: "confirmed" });
    if (bookingCount) return res.status(409).json({ message: "This show has confirmed bookings and cannot be deleted." });
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json({ message: "Show deleted successfully" });
  } catch (error) { res.status(400).json({ message: "Failed to delete show", error: error.message }); }
};

module.exports = { getDashboard, getAdminData, createMovie, updateMovie, deleteMovie, createTheatre, updateTheatre, deleteTheatre, createShow, updateShow, deleteShow };
