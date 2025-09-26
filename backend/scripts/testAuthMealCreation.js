require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User, MealPlan } = require('../models/postgres');

const testMealCreationWithAuth = async () => {
  try {
    console.log('🔐 Testing Meal Creation with Authentication...');
    
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');
    
    // Get admin user
    const admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) {
      console.log('❌ No admin user found!');
      return;
    }
    
    console.log(`✅ Found admin: ${admin.email} (ID: ${admin.id})`);
    
    // Create JWT token (same as login)
    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '2d' });
    console.log('✅ Generated JWT token');
    
    // Decode token to verify payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token payload:', payload);
    
    // Simulate creating a meal plan with proper auth
    const testMeal = {
      date: '2025-10-02',
      meal_name: 'Auth Test Meal',
      description: 'Testing meal creation with authentication',
      items: ['Test Item 1', 'Test Item 2'],
      nutritional_info: { calories: 400 },
      meal_type: 'lunch',
      total_quantity_planned: 50,
      cost_per_meal: 30.00,
      special_notes: 'Authentication test meal'
    };
    
    // Create meal with the user ID from JWT payload
    const createdMeal = await MealPlan.create({
      ...testMeal,
      created_by: payload.id  // Using the ID from JWT payload
    });
    
    console.log(`✅ Successfully created meal: ${createdMeal.meal_name}`);
    console.log(`   Created by user ID: ${createdMeal.created_by}`);
    
    // Clean up
    await createdMeal.destroy();
    console.log('🗑️ Cleaned up test meal');
    
    console.log('\n🎉 Authentication-based meal creation works correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.name === 'SequelizeValidationError') {
      error.errors.forEach(err => {
        console.error(`   - ${err.path}: ${err.message}`);
      });
    }
  }
  
  process.exit(0);
};

testMealCreationWithAuth();
