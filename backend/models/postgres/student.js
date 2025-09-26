const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');

const Student = sequelize.define('Student', {
  name: DataTypes.STRING,
  class: DataTypes.STRING,
  section: DataTypes.STRING,
  parent_id: { type: DataTypes.INTEGER, allowNull: true },
  user_id: { type: DataTypes.INTEGER, allowNull: true } // Link to User table for student users
});

module.exports = Student;