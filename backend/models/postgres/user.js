// Kept for reference if you prefer importing single models
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'teacher', 'parent', 'student'), allowNull: false }
});

module.exports = User;