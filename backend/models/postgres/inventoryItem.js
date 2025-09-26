const sequelize = require('../../config/postgres');
const { DataTypes } = require('sequelize');

const InventoryItem = sequelize.define('InventoryItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.ENUM('grains', 'vegetables', 'fruits', 'dairy', 'meat', 'spices', 'oils', 'others'),
    allowNull: false
  },
  current_stock: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  unit: {
    type: DataTypes.STRING, // kg, liters, pieces, etc.
    allowNull: false
  },
  minimum_threshold: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  cost_per_unit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  supplier_name: {
    type: DataTypes.STRING
  },
  supplier_contact: {
    type: DataTypes.STRING
  },
  last_purchased_date: {
    type: DataTypes.DATE
  },
  expiry_date: {
    type: DataTypes.DATE
  },
  storage_location: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('available', 'low_stock', 'out_of_stock', 'expired'),
    defaultValue: 'available'
  }
}, {
  tableName: 'inventory_items',
  timestamps: true
});

module.exports = InventoryItem;
