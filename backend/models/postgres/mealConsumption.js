const sequelize = require('../../config/postgres');
const { DataTypes } = require('sequelize');

const MealConsumption = sequelize.define('MealConsumption', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  meal_plan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'meal_plans',
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
  consumed_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  quantity_consumed: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 1.0 // Full portion = 1.0, half = 0.5, etc.
  },
  marked_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('consumed', 'partial', 'not_consumed', 'absent'),
    defaultValue: 'consumed'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'meal_consumption',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['meal_plan_id', 'student_id']
    },
    {
      fields: ['student_id', 'consumed_at']
    }
  ]
});

module.exports = MealConsumption;
