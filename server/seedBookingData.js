/*----- FILE: seedBookingData.js | CONTENT: Seed script for theatres and movie shows. | PURPOSE: Creates practical demo theatre/show data in MongoDB without deleting existing users. -----*/

require("dotenv").config();
const mongoose = require("mongoose");
const Movie = require("./models/movie");
const Theatre = require("./models/Theatre");
const Show = require("./models/Show");
const connectDB = require("./config/db");

const theatreData = [
  { name: "PVR Cinemas", location: "Himalaya Mall", city: "Ahmedabad", screens: 4 },
  { name: "INOX", location: "CG Road", city: "Ahmedabad", screens: 3 },
  { name: "Cinepolis", location: "Acropolis Mall", city: "Ahmedabad", screens: 5 },
];

const showTimes = [
  ["10:30 AM", "1:45 PM", "5:00 PM", "8:30 PM"],
  ["11:00 AM", "2:30 PM", "6:00 PM", "9:15 PM"],
  ["10:00 AM", "1:30 PM", "4:45 PM", "8:00 PM"],
];

const getDateOnly = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const seed = async () => {
  try {
    await connectDB();

    const movies = await Movie.find();
    if (movies.length === 0) {
      console.log("No movies found. Run npm run seed first.");
      process.exit(0);
    }

    await Theatre.deleteMany({});
    await Show.deleteMany({});

    const theatres = await Theatre.insertMany(theatreData);
    const shows = [];
    const today = getDateOnly(new Date());

    /*----- DYNAMIC FUTURE DATES: Creates shows starting from today and continuing for 30 days. -----*/
    for (let day = 0; day < 30; day += 1) {
      const showDate = new Date(today);
      showDate.setDate(today.getDate() + day);

      movies.forEach((movie, movieIndex) => {
        theatres.forEach((theatre, theatreIndex) => {
          showTimes[theatreIndex].forEach((time, timeIndex) => {
            shows.push({
              movie: movie._id,
              theatre: theatre._id,
              date: showDate,
              time,
              screen: (timeIndex % theatre.screens) + 1,
              price: 200,
            });
          });
        });
      });
    }

    await Show.insertMany(shows);

    console.log(`Created ${theatres.length} theatres.`);
    console.log(`Created ${shows.length} shows for today and the next 29 days.`);
    process.exit(0);
  } catch (error) {
    console.error("Booking seed failed:", error.message);
    process.exit(1);
  }
};

seed();
