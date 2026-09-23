# MovieMate Client - Practical Exam Guide

## Run

```cmd
npm install
npm run dev
```

## Public Pages
- `/` Home
- `/movies` Movies
- `/movies/:id` Movie Details
- `/login` Login
- `/register` Register

## Protected Pages
- `/book/:movieId` Booking
- `/seat-selection/:movieId` Seat Selection
- `/booking-summary/:movieId` Booking Summary
- `/payment/:movieId` Payment
- `/booking-confirmation` Confirmation
- `/my-bookings` My Bookings

## Admin
- `/admin` is available only to a logged-in user whose role is `admin`.
- Admin can insert movies, theatres, and shows using the forms.

## Dynamic Dates
The Booking page generates future dates from the computer's local current date. Past dates are never displayed. When today's date is selected, shows whose time has already passed are hidden.

## Comments
Important React/JS sections use the examination format `/*----- COMMENT -----*/`; JSX uses the valid JSX equivalent `{/*----- COMMENT -----*/}`. CSS sections explain important properties such as background-color, color, layout, and responsive design.
