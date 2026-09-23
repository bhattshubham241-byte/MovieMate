/*----- FILE: movieController.js | CONTENT: Controller functions for Movie API operations. | PURPOSE: Contains the business logic for reading, creating, updating, and deleting movie documents. -----*/

const Movie = require("../models/movie");


/*----- GET /api/movies: Fetch all movies from MongoDB. -----*/
const getMovies = async (req, res) => {

  try {

    /*----- FETCH ALL MOVIES -----*/
    const movies = await Movie.find().sort({ createdAt: -1 });

    /*----- SEND MOVIES TO CLIENT -----*/
    res.status(200).json(movies);

  } catch (error) {

    /*----- HANDLE GET ERROR -----*/
    res.status(500).json({
      message: "Failed to fetch movies",
      error: error.message,
    });
  }
};


/*----- GET /api/movies/:id: Fetch one movie using MongoDB ObjectId. -----*/
const getMovieById = async (req, res) => {

  try {

    /*----- FIND MOVIE BY ID -----*/
    const movie = await Movie.findById(req.params.id);

    /*----- CHECK IF MOVIE EXISTS -----*/
    if (!movie) {

      return res.status(404).json({
        message: "Movie not found",
      });
    }

    /*----- SEND MOVIE DATA -----*/
    res.status(200).json(movie);

  } catch (error) {

    /*----- HANDLE INVALID ID OR DATABASE ERROR -----*/
    res.status(400).json({
      message: "Invalid movie ID or failed to fetch movie",
      error: error.message,
    });
  }
};


/*----- POST /api/movies: Create a new movie from JSON request data. -----*/
const createMovie = async (req, res) => {

  try {

    /*----- CREATE MOVIE IN MONGODB -----*/
    const movie = await Movie.create(req.body);

    /*----- SEND SUCCESS RESPONSE -----*/
    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      movie,
    });

  } catch (error) {

    /*----- HANDLE MONGOOSE VALIDATION ERROR -----*/
    if (error.name === "ValidationError") {

      /*----- COLLECT ALL VALIDATION ERROR MESSAGES -----*/
      const errors = Object.values(error.errors)
        .map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    /*----- HANDLE DUPLICATE KEY ERROR -----*/
    if (error.code === 11000) {

      return res.status(400).json({
        success: false,
        message: "Movie already exists",
        error: error.message,
      });
    }

    /*----- HANDLE OTHER SERVER ERRORS -----*/
    res.status(500).json({
      success: false,
      message: "Server error while creating movie",
      error: error.message,
    });
  }
};


/*----- PUT /api/movies/:id: Update an existing movie. -----*/
const updateMovie = async (req, res) => {

  try {

    /*----- UPDATE MOVIE AND RUN MONGOOSE VALIDATION -----*/
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    /*----- CHECK IF MOVIE EXISTS -----*/
    if (!movie) {

      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    /*----- SEND UPDATED MOVIE -----*/
    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      movie,
    });

  } catch (error) {

    /*----- HANDLE MONGOOSE VALIDATION ERROR -----*/
    if (error.name === "ValidationError") {

      const errors = Object.values(error.errors)
        .map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    /*----- HANDLE INVALID MOVIE ID -----*/
    if (error.name === "CastError") {

      return res.status(400).json({
        success: false,
        message: "Invalid movie ID",
      });
    }

    /*----- HANDLE OTHER SERVER ERRORS -----*/
    res.status(500).json({
      success: false,
      message: "Server error while updating movie",
      error: error.message,
    });
  }
};


/*----- DELETE /api/movies/:id: Delete an existing movie. -----*/
const deleteMovie = async (req, res) => {

  try {

    /*----- DELETE MOVIE BY ID -----*/
    const movie = await Movie.findByIdAndDelete(req.params.id);

    /*----- CHECK IF MOVIE EXISTS -----*/
    if (!movie) {

      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    /*----- SEND SUCCESS RESPONSE -----*/
    res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });

  } catch (error) {

    /*----- HANDLE INVALID MOVIE ID -----*/
    if (error.name === "CastError") {

      return res.status(400).json({
        success: false,
        message: "Invalid movie ID",
      });
    }

    /*----- HANDLE OTHER SERVER ERRORS -----*/
    res.status(500).json({
      success: false,
      message: "Server error while deleting movie",
      error: error.message,
    });
  }
};


/*----- EXPORT MOVIE CONTROLLER FUNCTIONS -----*/
module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};