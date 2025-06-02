// models/flight.js
module.exports = (sequelize, DataTypes) => {
  const Flight = sequelize.define(
    "Flight",
    {
      flight_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      from_city_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "cities",
          key: "city_id",
        },
      },
      to_city_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "cities",
          key: "city_id",
        },
      },
      departure_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      arrival_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      seats_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seats_available: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "flights",
      timestamps: false,
      underscored: true,

      // Aşağıda, “aynı şehirden aynı saatte kalkan” ve
      // “aynı şehre aynı saatte inen” kurallarını
      // basitçe yakalamak için unique constraint ekliyoruz.
      // Burada “aynı saat” ifadesini, tam tarih-saat eşleşmesi
      // (yani minutes/seconds da aynı) olarak ele aldık.
      indexes: [
        {
          unique: true,
          fields: ["from_city_id", "departure_time"],
          name: "uniq_fromcity_departure",
        },
        {
          unique: true,
          fields: ["to_city_id", "arrival_time"],
          name: "uniq_tocity_arrival",
        },
      ],
    }
  );

  return Flight;
};
