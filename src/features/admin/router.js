const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin } = require("./controller");
const protect = require("../../middleware/authMiddleware");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);


module.exports = router;
