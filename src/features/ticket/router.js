const express = require("express");
const router = express.Router();
const {
  getAllTickets,
  getTicketsByEmail,
  bookTicket,
} = require("./controller");
const protect = require("../../middleware/authMiddleware");

router.get("/", protect, getAllTickets);

router.get("/:email", getTicketsByEmail);

router.post("/", bookTicket);

module.exports = router;
