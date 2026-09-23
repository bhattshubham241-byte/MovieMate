/*----- FILE: seedMovies.js | CONTENT: Sample Movie seed script. | PURPOSE: Loads sample movie data into the local MovieMate database so it can be viewed and edited through MongoDB Compass. -----*/

const mongoose = require("mongoose");
require("dotenv").config();

const Movie = require("./models/movie");
const movies = require("./data/movies.json");

/*----- SEED FUNCTION: Replaces the local movie collection with the sample records. -----*/
const seedMovies = async () => {
  const mongoURI =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/MovieMate";

  try {
    await mongoose.connect(mongoURI);

    /*----- Clear existing records so the sample data stays predictable during practical demonstrations. -----*/
    await Movie.deleteMany({});

    /*----- Insert all sample movies from data/movies.json. -----*/
    await Movie.insertMany(movies);

    console.log("Sample movies inserted successfully.");
  } catch (error) {
    console.error("Movie seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedMovies();
