const { Admin } = require("../models");
const asyncHandler = require("express-async-handler");
const { verifyToken } = require("./jwt");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Token bulunamadı");
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    res.status(401);
    throw new Error("Geçersiz veya süresi dolmuş token");
  }

  const admin = await Admin.findOne({
    where: { username: decoded.username },
    attributes: ["username"],
  });

  if (!admin) {
    res.status(401);
    throw new Error("Yetkisiz erişim");
  }

  req.user = admin;
  next();
});

module.exports = protect;
