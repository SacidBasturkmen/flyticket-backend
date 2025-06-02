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

router.get("/", getAllFlights);

router.get("/:id", getFlightById);

router.post("/", protect, createFlight);

router.put("/:id", protect, updateFlight);

router.delete("/:id", protect, deleteFlight);

module.exports = router;
