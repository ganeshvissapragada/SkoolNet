const sequelize = require('../../config/postgres');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'teacher', 'parent', 'student'), allowNull: false }
});

const Class = sequelize.define('Class', {
  class_name: DataTypes.STRING,
  section: DataTypes.STRING
});

const Subject = sequelize.define('Subject', {
  name: DataTypes.STRING
});

Subject.belongsTo(Class, { foreignKey: 'class_id' });
Class.hasMany(Subject, { foreignKey: 'class_id' });

const Student = sequelize.define('Student', {
  name: DataTypes.STRING,
  class: DataTypes.STRING,
  section: DataTypes.STRING,
  parent_id: { type: DataTypes.INTEGER, allowNull: true }
});

Student.belongsTo(User, { as: 'parent', foreignKey: 'parent_id' });
User.hasMany(Student, { as: 'children', foreignKey: 'parent_id' });

module.exports = {
  sequelize,
  User,
  Student,
  Class,
  Subject
};