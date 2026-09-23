/*----- FILE: movieRoutes.js | CONTENT: Express routes related to movies. | PURPOSE: Maps HTTP methods and URL paths to the correct movie controller functions. -----*/

const express = require("express");

const {
  getMovies,
  getMovieById,
} = require("../controllers/movieController");

/*----- ROUTER: Creates a separate Express router for Movie APIs. -----*/
const router = express.Router();

/*----- GET /: Return all movies. -----*/
router.get("/", getMovies);

/*----- GET /:id: Return one movie by its MongoDB ID. -----*/
router.get("/:id", getMovieById);

module.exports = router;
