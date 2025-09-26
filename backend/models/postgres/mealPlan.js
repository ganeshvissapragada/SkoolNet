const sequelize = require('../../config/postgres');
const { DataTypes } = require('sequelize');

const MealPlan = sequelize.define('MealPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true
  },
  meal_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  items: {
    type: DataTypes.JSON, // Array of meal items
    allowNull: false
  },
  nutritional_info: {
    type: DataTypes.JSON, // Calories, protein, carbs, etc.
    allowNull: false,
    defaultValue: {}
  },
  allergens: {
    type: DataTypes.JSON, // Array of allergen warnings
    defaultValue: []
  },
  meal_type: {
    type: DataTypes.ENUM('breakfast', 'lunch', 'snack', 'dinner'),
    defaultValue: 'lunch'
  },
  total_quantity_planned: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cost_per_meal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('planned', 'prepared', 'served', 'completed'),
    defaultValue: 'planned'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  special_notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'meal_plans',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['date', 'meal_type']
    }
  ]
});

module.exports = MealPlan;
