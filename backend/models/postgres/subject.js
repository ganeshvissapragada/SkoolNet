const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');

const Subject = sequelize.define('Subject', {
  name: DataTypes.STRING,
  class_id: DataTypes.INTEGER
});

module.exports = Subject;