/*----- FILE: db.js | CONTENT: MongoDB connection configuration. | PURPOSE: Connects the MovieMate Express backend to the local MongoDB MovieMate database. -----*/

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    /*----- MONGODB CONNECTION: Uses the URI stored in server/.env. -----*/
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
