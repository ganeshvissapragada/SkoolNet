const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');

const Scholarship = sequelize.define('Scholarship', {
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
    type: DataTypes.TEXT
  },
  eligibility_criteria: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  scholarship_amount: {
    type: DataTypes.DECIMAL(10, 2), // For Indian Rupees with precision
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR'
  },
  benefits: {
    type: DataTypes.TEXT // Additional benefits beyond monetary amount
  },
  required_documents: {
    type: DataTypes.JSON, // Array of required documents
    allowNull: false
  },
  application_deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  contact_person: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  contact_phone: {
    type: DataTypes.STRING
  },
  department: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'expired'),
    defaultValue: 'active'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  application_start_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  max_applications: {
    type: DataTypes.INTEGER, // Optional limit on number of applications
    allowNull: true
  },
  scholarship_type: {
    type: DataTypes.ENUM('merit', 'need_based', 'sports', 'arts', 'minority', 'other'),
    defaultValue: 'merit'
  },
  class_eligibility: {
    type: DataTypes.JSON // Array of eligible classes (e.g., ["10", "11", "12"])
  }
}, {
  tableName: 'scholarships',
  timestamps: true,
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['application_deadline']
    },
    {
      fields: ['created_by']
    }
  ]
});

module.exports = Scholarship;
