/*----- FILE: Theatre.js | CONTENT: Defines the Theatre schema and MongoDB model. | PURPOSE: Stores cinema theatre information used during ticket booking. -----*/

const mongoose = require("mongoose");

/*----- SCHEMA: Defines the fields stored for every theatre. -----*/
const theatreSchema = new mongoose.Schema(
  {
    /*----- THEATRE NAME: Name of the cinema chain or theatre. -----*/
    name: { type: String, required: true, trim: true },

    /*----- LOCATION: Mall, road, or area where the theatre is located. -----*/
    location: { type: String, required: true, trim: true },

    /*----- CITY: City in which the theatre is located. -----*/
    city: { type: String, required: true, trim: true },

    /*----- SCREENS: Number of screens available in the theatre. -----*/
    screens: { type: Number, default: 1 },
  },
  { timestamps: true }
);

/*----- MODEL: Creates the Theatre model used by the booking APIs. -----*/
module.exports = mongoose.model("Theatre", theatreSchema);
