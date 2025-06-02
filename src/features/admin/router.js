// features/admin/router.js
const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin } = require("./controller");
const protect = require("../../middleware/authMiddleware");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

/* // Korumalı örnek rota
router.get("/me", protect, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username });
}); */

module.exports = router;
