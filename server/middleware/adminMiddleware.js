/*----- FILE: adminMiddleware.js | CONTENT: Admin authorization middleware. | PURPOSE: Allows only authenticated users with the admin role to access administration APIs. -----*/

const jwt = require("jsonwebtoken");

/*----- ADMIN AUTHENTICATION: Verifies the JWT and checks that the logged-in user has the admin role. -----*/
const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = requireAdmin;
