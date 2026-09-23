/*----- FILE: Show.js | CONTENT: Defines the Show schema and MongoDB model. | PURPOSE: Stores movie show schedules by movie, theatre, date, and time. -----*/

const mongoose = require("mongoose");

/*----- SCHEMA: A show connects one movie with one theatre at a specific date and time. -----*/
const showSchema = new mongoose.Schema(
  {
    /*----- MOVIE: Reference to the movie being shown. -----*/
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },

    /*----- THEATRE: Reference to the theatre where the show is scheduled. -----*/
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre", required: true },

    /*----- DATE: Calendar date of the show. -----*/
    date: { type: Date, required: true },

    /*----- TIME: Human-readable show time such as 5:00 PM. -----*/
    time: { type: String, required: true },

    /*----- SCREEN: Screen number inside the theatre. -----*/
    screen: { type: Number, default: 1 },

    /*----- PRICE: Ticket price for this show. -----*/
    price: { type: Number, default: 200 },
  },
  { timestamps: true }
);

/*----- INDEX: Makes show lookup by movie and date faster. -----*/
showSchema.index({ movie: 1, date: 1 });

/*----- MODEL: Creates the Show model used by the booking APIs. -----*/
module.exports = mongoose.model("Show", showSchema);
