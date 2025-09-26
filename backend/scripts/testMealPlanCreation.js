require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, MealPlan } = require('../models/postgres');

const testMealPlanCreation = async () => {
  try {
    console.log('🧪 Testing Meal Plan Creation with created_by field...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');
    
    // Get or create admin user
    let admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      admin = await User.create({
        name: 'Test Admin',
        email: 'test-admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`✅ Created admin user: ${admin.email} (ID: ${admin.id})`);
    } else {
      console.log(`✅ Found admin user: ${admin.email} (ID: ${admin.id})`);
    }

    // Test creating a new meal plan
    const testMealPlan = {
      date: '2025-10-01',
      meal_name: 'Test Meal Plan',
      description: 'A test meal plan to verify created_by field works',
      items: ['Test Rice', 'Test Dal', 'Test Vegetable'],
      nutritional_info: {
        calories: 400,
        protein: 15,
        carbohydrates: 60,
        fat: 10
      },
      allergens: ['None'],
      meal_type: 'lunch',
      total_quantity_planned: 100,
      cost_per_meal: 25.00,
      special_notes: 'Test meal created to verify created_by field'
    };

    console.log('🍽️ Creating test meal plan...');
    
    const createdMeal = await MealPlan.create({
      ...testMealPlan,
      created_by: admin.id
    });
    
    console.log(`✅ Successfully created meal plan: ${createdMeal.meal_name}`);
    console.log(`   ID: ${createdMeal.id}`);
    console.log(`   Date: ${createdMeal.date}`);
    console.log(`   Created by: ${createdMeal.created_by} (Admin ID: ${admin.id})`);
    console.log(`   Status: ${createdMeal.status}`);
    
    // Verify the meal plan was created correctly
    const retrievedMeal = await MealPlan.findByPk(createdMeal.id);
    if (retrievedMeal && retrievedMeal.created_by === admin.id) {
      console.log('✅ created_by field is correctly set!');
    } else {
      console.log('❌ created_by field issue persists');
    }
    
    // Clean up - delete the test meal plan
    await createdMeal.destroy();
    console.log('🗑️ Cleaned up test meal plan');
    
    console.log('\n🎉 Test completed successfully! The created_by issue has been fixed.');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error testing meal plan creation:', error.message);
    if (error.name === 'SequelizeValidationError') {
      error.errors.forEach(err => {
        console.error(`   - ${err.path}: ${err.message}`);
      });
    }
    process.exit(1);
  }
};

testMealPlanCreation();
