module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define(
    "Ticket",
    {
      ticket_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      passenger_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      passenger_surname: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      passenger_email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      flight_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "flights",
          key: "flight_id",
        },
      },
      seat_number: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
    },
    {
      tableName: "tickets",
      timestamps: false,
      underscored: true,
    }
  );

  return Ticket;
};
