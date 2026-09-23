/*----- FILE: movie.js | CONTENT: Mongoose Movie schema and model. | PURPOSE: Stores movie information plus the seat layout and category pricing configured by the administrator. -----*/

const mongoose = require("mongoose");

/*----- SEAT CATEGORY SCHEMA: Defines a ticket category, its rows, and price. -----*/
const seatCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rows: { type: [String], required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    genre: { type: [String], required: true },
    language: { type: String, required: true },
    duration: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    poster: { type: String, required: true },
    trailer: { type: String },
    rating: { type: Number, default: 0 },
    //New Add
    director: { type:String, required: true, minlength: 2, maxlength:100, trim:true},

    /*----- SEATING CONFIGURATION: Stores the rows and number of seats in every row for this movie. -----*/
    seating: {
      rows: { type: [String], default: ["A", "B", "C", "D", "E", "F"] },
      seatsPerRow: { type: Number, default: 8, min: 1 },
      categories: {
        type: [seatCategorySchema],
        default: [
          { name: "Silver", rows: ["A", "B"], price: 150 },
          { name: "Gold", rows: ["C", "D"], price: 200 },
          { name: "Platinum", rows: ["E", "F"], price: 250 },
        ],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
