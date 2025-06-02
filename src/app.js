// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models");

const app = express();

// HTTP isteği loglamak için morgan
app.use(morgan("dev"));

// JSON ve CORS middleware’leri
app.use(cors());
app.use(express.json());

// Rotlar
app.use("/api/admin", require("./features/admin/router"));
app.use("/api/city", require("./features/city/router"));
app.use("/api/flight", require("./features/flight/router"));
app.use("/api/ticket", require("./features/ticket/router"));

// Tanımlanmamış rota geldiğinde 404 dönecek
app.use((req, res, next) => {
  res.status(404).json({ error: "Route bulunamadı" });
});

// Hata yakalama middleware’i
app.use((err, req, res, next) => {
  console.error(err);
  const status = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({ error: err.message || "Sunucu hatası" });
});

// Veritabanı eşitleme ve senkronizasyon
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Veritabanı senkronize edildi.");

    // Sunucuyu başlat
    const PORT = process.env.PORT || 5252;
    app.listen(PORT, () => {
      console.log(`Sunucu ${PORT} portunda çalışıyor.`);
    });
  })
  .catch((err) => {
    console.error("Sync hatası:", err);
  });
