// features/city/router.js
const express = require("express");
const router = express.Router();
const {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
} = require("./controller");
const protect = require("../../middleware/authMiddleware");

// GET  /api/city         → Herkes erişebilir
router.get("/", getAllCities);

// GET  /api/city/:id     → Herkes erişebilir
router.get("/:id", getCityById);

// POST /api/city         → Admin-only
router.post("/", protect, createCity);

// PUT  /api/city/:id     → Admin-only
router.put("/:id", protect, updateCity);

// DELETE /api/city/:id    → Admin-only
router.delete("/:id", protect, deleteCity);

module.exports = router;
