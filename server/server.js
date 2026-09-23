/*----- FILE: server.js | CONTENT: Main Express server configuration and application entry point. | PURPOSE: Starts the backend, connects MongoDB before accepting requests, enables middleware, and registers MovieMate API routes. -----*/

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const movieRoutes = require("./routes/movieRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

/*----- MIDDLEWARE: Allows frontend requests and lets Express read JSON request bodies. -----*/
app.use(cors());
app.use(express.json());

/*----- TEST ROUTE: Confirms that the MovieMate backend is running. -----*/
app.get("/", (req, res) => {
  res.send("MovieMate API is running...");
});

/*----- API ROUTES: Sends movie and authentication requests to their route files. -----*/
app.use("/api/movies", movieRoutes);

/*----- BOOKING ROUTES: Provides theatre and show data used by the booking page. -----*/
app.use("/api/booking", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

/*----- SERVER START: Connect to MongoDB first so the API does not start with a missing database connection. -----*/
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
