// models/index.js
require("dotenv").config(); // <— Ortam değişkenlerini yükler
const { Sequelize, DataTypes } = require("sequelize");

// .env içindeki değerleri kullanıyoruz:
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

const City = require("./city")(sequelize, DataTypes);
const Flight = require("./flight")(sequelize, DataTypes);
const Ticket = require("./ticket")(sequelize, DataTypes);
const Admin = require("./admin")(sequelize, DataTypes);

// İlişkiler
City.hasMany(Flight, {
  foreignKey: "from_city_id",
  as: "departingFlights",
});
Flight.belongsTo(City, { foreignKey: "from_city_id", as: "fromCity" });

City.hasMany(Flight, {
  foreignKey: "to_city_id",
  as: "arrivingFlights",
});
Flight.belongsTo(City, { foreignKey: "to_city_id", as: "toCity" });

Flight.hasMany(Ticket, { foreignKey: "flight_id", as: "tickets" });
Ticket.belongsTo(Flight, { foreignKey: "flight_id", as: "flight" });

module.exports = {
  sequelize,
  City,
  Flight,
  Ticket,
  Admin,
};
