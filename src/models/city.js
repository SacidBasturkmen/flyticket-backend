// models/city.js
module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define(
    "City",
    {
      city_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      city_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      tableName: "cities",
      timestamps: false,
      underscored: true,
    }
  );

  return City;
};
