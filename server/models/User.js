/*----- FILE: User.js | CONTENT: Defines the User schema and MongoDB model. | PURPOSE: Stores registered MovieMate users so login and protected booking features can identify users. -----*/

const mongoose = require("mongoose");

/*----- USER SCHEMA: Defines the fields and validation rules for each user document. -----*/
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    /*----- ROLE: Identifies whether the account is a normal customer or an administrator. -----*/
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
