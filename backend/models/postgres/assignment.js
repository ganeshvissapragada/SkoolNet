const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
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
  assignment_type: {
    type: DataTypes.ENUM('homework', 'project', 'group_work', 'practice', 'extra_credit'),
    allowNull: false,
    defaultValue: 'homework'
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  submission_deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_graded: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allow_late_submission: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  max_marks: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  instructions: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'closed'),
    defaultValue: 'draft'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'assignments',
  timestamps: true
});

module.exports = Assignment;
