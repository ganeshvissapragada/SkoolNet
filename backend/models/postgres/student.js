const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');

const Student = sequelize.define('Student', {
  name: DataTypes.STRING,
  class: DataTypes.STRING,
  section: DataTypes.STRING,
  parent_id: { type: DataTypes.INTEGER, allowNull: true }
});

module.exports = Student;