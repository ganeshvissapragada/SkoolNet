const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');

const AssignmentSubmission = sequelize.define('AssignmentSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  assignment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'assignments',
      key: 'id'
    }
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Students',
      key: 'id'
    }
  },
  submitted_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  submission_text: {
    type: DataTypes.TEXT
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  submission_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  is_late: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('submitted', 'graded', 'returned', 'resubmitted'),
    defaultValue: 'submitted'
  },
  marks_obtained: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  graded_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  graded_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resubmission_requested: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  resubmission_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'assignment_submissions',
  timestamps: true
});

module.exports = AssignmentSubmission;
