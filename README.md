# MovieMate - Final MERN Movie Ticket Booking System

/*----- PROJECT PURPOSE: MovieMate is a MERN practical project for movie browsing, authentication, theatre/show selection, seat selection, demo payment, real booking storage, and booking history. -----*/

## 1. Technology

- React + Vite
- React Router
- Axios
- Lucide React
- Node.js + Express
- MongoDB + Mongoose
- MongoDB Compass
- bcryptjs
- JSON Web Token (JWT)

## 2. Final Project Structure

```text
MovieMate/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Admin.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── BookingConfirmation.jsx
│   │   │   ├── BookingSummary.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── Movies.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── Register.jsx
│   │   │   └── SeatSelection.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   └── App.jsx
│   ├── .env
│   └── package.json
│
├── server/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── movieController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Show.js
│   │   ├── Theatre.js
│   │   ├── User.js
│   │   └── movie.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── movieRoutes.js
│   ├── data/movies.json
│   ├── seedMovies.js
│   ├── seedBookingData.js
│   ├── seedAdmin.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

## 3. MongoDB Setup

/*----- DATABASE: The final version uses local MongoDB to avoid the previous Atlas TLS/OpenSSL connection problem. -----*/

1. Start MongoDB Community Server.
2. Open MongoDB Compass.
3. Connect to:

```text
mongodb://127.0.0.1:27017
```

4. Use the database:

```text
MovieMate
```

The final application uses these collections:

```text
MovieMate
├── movies
├── users
├── theatres
├── shows
└── bookings
```

## 4. Backend Environment

`server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/MovieMate
JWT_SECRET=MovieMate_Practical_JWT_Secret_2026
```

/*----- MONGODB URI: This connects the Express backend to the local MovieMate MongoDB database. -----*/

/*----- JWT SECRET: This secret is used to sign and verify authentication tokens. Use a stronger private secret for production. -----*/

## 5. Start the Backend

Open a terminal in `MovieMate/server`:

```cmd
npm install
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

## 6. Seed Data

Run these commands from `MovieMate/server` when fresh data is required:

```cmd
npm run seed
npm run seed-booking
npm run seed-admin
```

/*----- MOVIE SEED: Inserts the sample movies from data/movies.json. -----*/

/*----- BOOKING SEED: Creates theatres and shows for the movies. The generated shows start from the day the seed command is run and continue for 30 days. -----*/

/*----- ADMIN SEED: Creates or upgrades the administrator account without deleting existing users. -----*/

### Default Admin Account

```text
Email: admin@moviemate.com
Password: Admin@123
```

## 7. Start the Frontend

Open a second terminal in `MovieMate/client`:

```cmd
npm install
npm run dev
```

Frontend URL is normally:

```text
http://localhost:5173
```

`client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 8. Authentication

```text
Guest
  ↓
Home / Movies / Movie Details
  ↓
Book Tickets
  ↓
Login / Register Required
  ↓
Booking Flow
```

/*----- AUTHENTICATION: Passwords are hashed with bcryptjs and successful login returns a JWT containing the user ID and role. -----*/

Public routes:

```text
/
/movies
/movies/:id
/login
/register
```

Protected user routes:

```text
/book/:movieId
/seat-selection/:movieId
/booking-summary/:movieId
/payment/:movieId
/booking-confirmation
/my-bookings
```

Admin route:

```text
/admin
```

## 9. Complete Booking Flow

```text
Home
  ↓
Movies
  ↓
Movie Details
  ↓
Login/Register
  ↓
Select Date
  ↓
Select Theatre
  ↓
Select Show
  ↓
Select Seats
  ↓
Booking Summary
  ↓
Demo Payment
  ↓
Booking Confirmation
  ↓
My Bookings
```

## 10. Dynamic Dates and Shows

The booking page generates dates from the browser's current date. Past dates are not displayed.

For example, if today is September 11, the selectable dates begin at September 11 and continue with future dates.

For today's date, past show times are also filtered out.

## 11. Real Booking Functionality

The final version stores bookings in MongoDB.

API endpoints:

```text
GET  /api/booking/theatres
GET  /api/booking/shows?movieId=...&date=...
GET  /api/booking/occupied-seats?showId=...
POST /api/booking/bookings
GET  /api/booking/my-bookings
```

/*----- OCCUPIED SEATS: Seat availability is loaded from MongoDB for the selected show, so already-booked seats are disabled for later users. -----*/

/*----- DOUBLE BOOKING PROTECTION: The backend checks seat availability again during booking and the Booking model uses a unique show-seat index. -----*/

The booking rule is:

```text
Same Movie + Same Theatre + Same Date + Same Show + Same Seat
→ Cannot be booked twice
```

The same seat can be booked for a different show or date.

## 12. Payment

/*----- PAYMENT NOTE: The payment page is a demonstration screen. It does not process real card payments. A successful demo payment sends the booking request to the Express backend. -----*/

## 13. Admin Panel

The admin panel allows an administrator to add:

- Movies
- Theatres
- Shows

Admin APIs:

```text
POST /api/admin/movies
POST /api/admin/theatres
POST /api/admin/shows
```

Only users with the `admin` role can access these APIs.

## 14. Examination Notes

- Every server file begins with a `/*----- ... -----*/` file-purpose comment.
- Explanatory code comments use the requested `/*----- COMMENT -----*/` style.
- JSX comments use the corresponding JSX comment syntax.
- CSS files include comments for important visual sections and properties.
- MongoDB connection is centralized in `server/config/db.js`.
- Authentication state is centralized in `client/src/context/AuthContext.jsx`.
- API calls are centralized in `client/src/services/api.js`.
- `ProtectedRoute.jsx` prevents guests from opening protected booking pages.
- `AdminRoute.jsx` restricts the admin page to admin users.

## 15. Fresh Installation Order

```cmd
:: Terminal 1 - Backend
cd MovieMate\server
npm install
npm run seed
npm run seed-booking
npm run seed-admin
npm run dev
```

```cmd
:: Terminal 2 - Frontend
cd MovieMate\client
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

## 16. Final Testing Checklist

```text
[ ] MongoDB Community Server is running
[ ] MovieMate database exists
[ ] Movies are visible
[ ] Register works
[ ] Login works
[ ] Logout works
[ ] Guest cannot directly access booking pages
[ ] Date selection does not show past dates
[ ] Theatre and show selection works
[ ] Seat selection works
[ ] Occupied seats are disabled
[ ] Booking is stored in MongoDB
[ ] Same seat cannot be booked twice for the same show
[ ] Confirmation page shows booking details
[ ] My Bookings shows the logged-in user's bookings
[ ] Admin login works
[ ] Admin can add movie, theatre, and show
```

/*----- FINAL STATUS: This package is the final working MovieMate version with authentication, admin access, dynamic booking data, real MongoDB booking persistence, occupied-seat prevention, confirmation, and My Bookings. -----*/

## Theme Mode

- Light Mode and Dark Mode are available from the Navbar.
- Desktop users can use the Moon/Sun theme button.
- Mobile users can use the Dark Mode/Light Mode option in the mobile menu.
- The selected theme is saved in browser localStorage using `moviemateTheme`, so the mode remains selected after refreshing the page.

## Faculty Requested Updates

The final version includes the latest faculty-requested functionality:

- Admin Dashboard with movies, theatres, shows, users, bookings, and revenue statistics.
- Admin Management page for Add, Update, and Delete operations.
- Movie-specific seat layout configuration (for example rows A-F and 7 seats per row).
- Multiple ticket categories such as Silver, Gold, and Platinum.
- Different ticket prices can be configured for different row categories.
- Seat selection is generated from the movie's configured layout.
- Booking totals are calculated from the selected seat's category price.
- Existing occupied-seat protection remains active.
