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

router.get("/", getAllCities);

router.get("/:id", getCityById);

router.post("/", protect, createCity);

router.put("/:id", protect, updateCity);

router.delete("/:id", protect, deleteCity);

module.exports = router;
