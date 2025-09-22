const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');

const Class = sequelize.define('Class', {
  class_name: DataTypes.STRING,
  section: DataTypes.STRING
});

module.exports = Class;