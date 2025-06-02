// features/ticket/router.js
const express = require("express");
const router = express.Router();
const {
  getAllTickets,
  getTicketsByEmail,
  bookTicket,
} = require("./controller");
const protect = require("../../middleware/authMiddleware");

// GET    /api/ticket             → Admin-only: tüm biletleri listele
router.get("/", protect, getAllTickets);

// GET    /api/ticket/:email      → E-posta adresine göre biletleri listele (public)
router.get("/:email", getTicketsByEmail);

// POST   /api/ticket             → Bilet oluştur (book ticket) (public)
router.post("/", bookTicket);

module.exports = router;
