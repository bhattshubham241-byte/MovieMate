/*----- FILE: adminRoutes.js | CONTENT: Protected administration API routes. | PURPOSE: Restricts dashboard and CRUD operations to authenticated admin users. -----*/

const express = require("express");
const requireAdmin = require("../middleware/adminMiddleware");
const controller = require("../controllers/adminController");

const router = express.Router();

router.use(requireAdmin);
router.get("/dashboard", controller.getDashboard);
router.get("/data", controller.getAdminData);
router.post("/movies", controller.createMovie);
router.put("/movies/:id", controller.updateMovie);
router.delete("/movies/:id", controller.deleteMovie);
router.post("/theatres", controller.createTheatre);
router.put("/theatres/:id", controller.updateTheatre);
router.delete("/theatres/:id", controller.deleteTheatre);
router.post("/shows", controller.createShow);
router.put("/shows/:id", controller.updateShow);
router.delete("/shows/:id", controller.deleteShow);

module.exports = router;
