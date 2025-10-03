const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');

const TeacherAssignment = sequelize.define('TeacherAssignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Classes',
      key: 'id'
    }
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Subjects',
      key: 'id'
    }
  },
  academic_year: {
    type: DataTypes.STRING,
    defaultValue: new Date().getFullYear().toString()
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'teacher_assignments',
  timestamps: true
});

module.exports = TeacherAssignment;
