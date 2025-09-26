require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, MealPlan } = require('../models/postgres');

// 🍽️ YOUR CUSTOM MEALS - Edit this array to add your own meals!
const myCustomMeals = [
  {
    date: '2025-10-03',
    meal_name: 'Mediterranean Bowl',
    description: 'Fresh Mediterranean-style bowl with hummus, grilled vegetables, and quinoa',
    items: [
      'Quinoa',
      'Grilled Zucchini', 
      'Cherry Tomatoes',
      'Hummus',
      'Olives',
      'Feta Cheese',
      'Pita Bread'
    ],
    nutritional_info: {
      calories: 520,
      protein: 18,
      carbohydrates: 68,
      fat: 20,
      fiber: 12,
      vitamins: 'Rich in Vitamin C, K, Folate, and Mediterranean antioxidants'
    },
    allergens: ['Gluten (Pita)', 'Dairy (Feta)'],
    meal_type: 'lunch',
    total_quantity_planned: 200,
    cost_per_meal: 42.00,
    special_notes: 'Vegan option available without feta cheese'
  },
  {
    date: '2025-10-04',
    meal_name: 'Mexican Fiesta Plate',
    description: 'Colorful Mexican-inspired meal with beans, rice, and fresh salsa',
    items: [
      'Cilantro Lime Rice',
      'Black Bean Curry',
      'Roasted Corn Salsa',
      'Avocado Slices',
      'Whole Wheat Tortilla',
      'Fresh Salad',
      'Lime Wedges'
    ],
    nutritional_info: {
      calories: 480,
      protein: 16,
      carbohydrates: 75,
      fat: 15,
      fiber: 14,
      vitamins: 'High in Vitamin C, Folate, and plant-based protein'
    },
    allergens: ['Gluten (Tortilla)'],
    meal_type: 'lunch',
    total_quantity_planned: 180,
    cost_per_meal: 38.50,
    special_notes: 'Naturally vegan and rich in plant protein'
  },
  {
    date: '2025-10-05',
    meal_name: 'Asian Fusion Delight',
    description: 'Asian-inspired stir-fry with tofu, vegetables, and jasmine rice',
    items: [
      'Jasmine Rice',
      'Tofu Stir-fry',
      'Mixed Asian Vegetables',
      'Teriyaki Sauce',
      'Sesame Seeds',
      'Spring Rolls (2 pieces)',
      'Fortune Cookie'
    ],
    nutritional_info: {
      calories: 460,
      protein: 20,
      carbohydrates: 62,
      fat: 16,
      fiber: 8,
      vitamins: 'Rich in Vitamin A, C, and plant-based protein'
    },
    allergens: ['Soy (Tofu)', 'Gluten (Spring Rolls)', 'Sesame'],
    meal_type: 'lunch',
    total_quantity_planned: 220,
    cost_per_meal: 40.00,
    special_notes: 'High protein vegetarian option with authentic Asian flavors'
  }
];

const createMyCustomMeals = async () => {
  try {
    console.log('🍽️ Creating Your Custom Meals...');
    console.log('=' .repeat(50));
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');
    
    // Get or create admin user
    let admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`✅ Created admin user: ${admin.email}`);
    } else {
      console.log(`✅ Using admin: ${admin.email} (ID: ${admin.id})`);
    }

    console.log(`\n🎯 Creating ${myCustomMeals.length} custom meals...`);
    
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const mealData of myCustomMeals) {
      try {
        // Check if meal already exists
        const existingMeal = await MealPlan.findOne({
          where: { 
            date: mealData.date, 
            meal_type: mealData.meal_type 
          }
        });
        
        if (existingMeal) {
          console.log(`⚠️ Meal for ${mealData.date} already exists: ${existingMeal.meal_name}`);
          skippedCount++;
          continue;
        }
        
        // Create the meal plan
        const createdMeal = await MealPlan.create({
          ...mealData,
          created_by: admin.id
        });
        
        console.log(`✅ Created: ${createdMeal.meal_name} (${createdMeal.date})`);
        console.log(`   💰 Cost: ₹${createdMeal.cost_per_meal} | 🍽️ Quantity: ${createdMeal.total_quantity_planned}`);
        console.log(`   🥗 Items: ${createdMeal.items.slice(0,3).join(', ')}...`);
        
        createdCount++;
        
      } catch (err) {
        console.error(`❌ Error creating meal for ${mealData.date}: ${err.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Custom Meal Creation Complete!');
    console.log(`✅ Successfully created: ${createdCount} meals`);
    console.log(`⚠️ Skipped existing: ${skippedCount} meals`);
    
    // Show summary of all meals
    console.log('\n📋 All Your Meals:');
    const allMeals = await MealPlan.findAll({
      order: [['date', 'ASC']],
      attributes: ['date', 'meal_name', 'cost_per_meal', 'total_quantity_planned']
    });
    
    allMeals.forEach((meal, index) => {
      console.log(`   ${index + 1}. ${meal.date} - ${meal.meal_name} - ₹${meal.cost_per_meal} (${meal.total_quantity_planned} servings)`);
    });
    
    console.log('\n🌐 Test your meals at: http://localhost:5176/');
    console.log('🔐 Login as admin: admin@example.com / Admin@123');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating custom meals:', error.message);
    process.exit(1);
  }
};

// 💡 INSTRUCTIONS:
// 1. Edit the 'myCustomMeals' array above to add your own meals
// 2. Change dates, names, items, costs as needed
// 3. Run this script: node scripts/createMyMeals.js

createMyCustomMeals();
