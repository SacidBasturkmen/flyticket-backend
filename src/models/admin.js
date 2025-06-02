// models/admin.js
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
      username: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "admin_user",
      timestamps: false,
      underscored: true,
    }
  );

  return Admin;
};
