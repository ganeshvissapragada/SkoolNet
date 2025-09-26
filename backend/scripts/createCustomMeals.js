require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, MealPlan } = require('../models/postgres');

// 🍽️ ADD YOUR CUSTOM MEALS HERE
const customMeals = [
  {
    date: '2025-10-01',
    meal_name: 'Italian Pasta Special',
    description: 'Delicious Italian-style pasta with fresh vegetables and herbs',
    items: ['Penne Pasta', 'Tomato Basil Sauce', 'Mixed Vegetables', 'Garlic Bread', 'Parmesan Cheese', 'Fresh Salad'],
    nutritional_info: {
      calories: 520,
      protein: 20,
      carbohydrates: 75,
      fat: 15,
      fiber: 6,
      vitamins: 'Rich in Vitamin C, Iron, and Calcium'
    },
    allergens: ['Gluten', 'Dairy', 'May contain nuts'],
    meal_type: 'lunch',
    total_quantity_planned: 200,
    cost_per_meal: 45.00,
    special_notes: 'Vegan option available without cheese'
  },
  {
    date: '2025-10-02',
    meal_name: 'Mexican Fiesta Bowl',
    description: 'Colorful Mexican-inspired rice bowl with beans and fresh toppings',
    items: ['Mexican Rice', 'Black Beans', 'Corn Salsa', 'Guacamole', 'Tortilla Chips', 'Lime Wedges'],
    nutritional_info: {
      calories: 480,
      protein: 18,
      carbohydrates: 68,
      fat: 14,
      fiber: 10,
      vitamins: 'High in Vitamin A, C, and Folate'
    },
    allergens: ['May contain traces of nuts'],
    meal_type: 'lunch',
    total_quantity_planned: 180,
    cost_per_meal: 42.00,
    special_notes: 'Spice level can be adjusted on request'
  },
  {
    date: '2025-10-03',
    meal_name: 'Asian Stir Fry Delight',
    description: 'Fresh Asian-style stir-fried vegetables with aromatic rice',
    items: ['Jasmine Rice', 'Mixed Stir Fry Vegetables', 'Teriyaki Sauce', 'Sesame Seeds', 'Spring Rolls', 'Sweet & Sour Soup'],
    nutritional_info: {
      calories: 460,
      protein: 16,
      carbohydrates: 72,
      fat: 12,
      fiber: 8,
      vitamins: 'Rich in Vitamin K, A, and antioxidants'
    },
    allergens: ['Soy', 'Sesame', 'Gluten'],
    meal_type: 'lunch',
    total_quantity_planned: 220,
    cost_per_meal: 40.00,
    special_notes: 'Gluten-free option available'
  }
];

const createCustomMeals = async () => {
  try {
    console.log('🍽️ Creating Your Custom Meals...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');
    
    // Get admin user (required for created_by field)
    let admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) {
      console.log('⚠️ Creating admin user...');
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
    }
    console.log(`✅ Using admin user: ${admin.email} (ID: ${admin.id})`);

    console.log('\n🍽️ Creating your custom meals...');
    
    let createdCount = 0;
    for (const mealData of customMeals) {
      try {
        const mealPlan = await MealPlan.create({
          ...mealData,
          created_by: admin.id
        });
        console.log(`✅ Created: ${mealPlan.meal_name} for ${mealPlan.date} (₹${mealPlan.cost_per_meal})`);
        createdCount++;
      } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
          console.log(`⚠️ Meal for ${mealData.date} already exists: ${mealData.meal_name}`);
        } else {
          console.error(`❌ Error creating meal for ${mealData.date}:`, err.message);
        }
      }
    }

    console.log(`\n🎉 Successfully created ${createdCount} custom meals!`);
    
    // Show all meals
    console.log('\n📋 All Your Meal Plans:');
    const allMeals = await MealPlan.findAll({ 
      order: [['date', 'ASC']],
      attributes: ['date', 'meal_name', 'cost_per_meal', 'total_quantity_planned']
    });
    
    allMeals.forEach(meal => {
      console.log(`   📅 ${meal.date} - ${meal.meal_name} - ₹${meal.cost_per_meal} (${meal.total_quantity_planned} servings)`);
    });

    console.log('\n💡 Tips:');
    console.log('   1. Login to admin dashboard to view/edit meals');
    console.log('   2. Add more meals by editing the customMeals array above');
    console.log('   3. Run this script again to add new meals');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating custom meals:', error);
    process.exit(1);
  }
};

// 🚀 To add more meals:
// 1. Edit the customMeals array above
// 2. Run: node scripts/createCustomMeals.js

createCustomMeals();
