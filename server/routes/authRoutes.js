/*----- FILE: authRoutes.js | CONTENT: Authentication API routes. | PURPOSE: Maps registration and login URLs to the authentication controller functions. -----*/

const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const router = express.Router();

/*----- POST /api/auth/register: Creates a new MovieMate user. -----*/
router.post("/register", registerUser);

/*----- POST /api/auth/login: Authenticates an existing MovieMate user. -----*/
router.post("/login", loginUser);

module.exports = router;
