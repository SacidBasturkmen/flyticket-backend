// features/flight/router.js
const express = require("express");
const router = express.Router();
const {
  getAllFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
} = require("./controller");
const protect = require("../../middleware/authMiddleware");

// GET    /api/flight        → Herkes erişebilir
router.get("/", getAllFlights);

// GET    /api/flight/:id    → Herkes erişebilir
router.get("/:id", getFlightById);

// POST   /api/flight        → Admin-only
router.post("/", protect, createFlight);

// PUT    /api/flight/:id    → Admin-only
router.put("/:id", protect, updateFlight);

// DELETE /api/flight/:id    → Admin-only
router.delete("/:id", protect, deleteFlight);

module.exports = router;
