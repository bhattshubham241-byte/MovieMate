/*----- FILE: authMiddleware.js | CONTENT: JWT authentication middleware. | PURPOSE: Protects backend routes by checking whether a valid login token was sent by the client. -----*/

const jwt = require("jsonwebtoken");

/*----- AUTHENTICATE: Reads the Bearer token, verifies it, and stores the user ID in req.userId. -----*/
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authenticate;
