require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models");

const app = express();

app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

app.use("/api/admin", require("./features/admin/router"));
app.use("/api/city", require("./features/city/router"));
app.use("/api/flight", require("./features/flight/router"));
app.use("/api/ticket", require("./features/ticket/router"));

app.use((req, res, next) => {
  res.status(404).json({ error: "Route bulunamadı" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({ error: err.message || "Sunucu hatası" });
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Veritabanı senkronize edildi.");

    const PORT = process.env.PORT || 5252;
    app.listen(PORT, () => {
      console.log(`Sunucu ${PORT} portunda çalışıyor.`);
    });
  })
  .catch((err) => {
    console.error("Sync hatası:", err);
  });
