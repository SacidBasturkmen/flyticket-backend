const { Admin } = require("../../models");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../../middleware/jwt");

const registerAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const existing = await Admin.findOne({ where: { username } });
  if (existing) {
    res.status(400);
    throw new Error("Username zaten kayıtlı");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    username,
    password: hashedPassword,
  });

  const token = generateToken({ username: admin.username });
  res.json({ message: "Kayıt başarılı", token });
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ where: { username } });
  if (!admin) {
    res.status(401);
    throw new Error("Geçersiz admin");
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    res.status(401);
    throw new Error("Geçersiz şifre");
  }

  const token = generateToken({ username: admin.username });
  res.json({ message: "Giriş başarılı", token });
});

module.exports = { registerAdmin, loginAdmin };
