require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, MealPlan, InventoryItem, MealConsumption, Student } = require('../models/postgres');
const MealFeedback = require('../models/mongo/mealFeedback');

const sampleMealPlans = [
  {
    date: '2025-09-26',
    meal_name: 'Vegetarian Thali',
    description: 'A complete nutritious vegetarian meal with rice, dal, vegetables, and chapati',
    items: ['Steamed Rice', 'Dal Tadka', 'Mixed Vegetable Curry', 'Chapati (2 pieces)', 'Pickle', 'Papad'],
    nutritional_info: {
      calories: 450,
      protein: 18,
      carbohydrates: 65,
      fat: 12,
      fiber: 8,
      vitamins: 'Rich in Vitamin A, C, Iron, and Calcium'
    },
    allergens: ['Gluten (Chapati)', 'May contain traces of nuts'],
    meal_type: 'lunch',
    total_quantity_planned: 250,
    cost_per_meal: 35.50,
    special_notes: 'Extra spicy option available on request'
  },
  {
    date: '2025-09-27',
    meal_name: 'Rajma Rice Bowl',
    description: 'Protein-rich kidney beans curry served with steamed basmati rice',
    items: ['Basmati Rice', 'Rajma Curry', 'Jeera Aloo', 'Butter Chapati', 'Onion Salad', 'Buttermilk'],
    nutritional_info: {
      calories: 480,
      protein: 22,
      carbohydrates: 70,
      fat: 10,
      fiber: 12,
      vitamins: 'High in protein, Iron, and B-complex vitamins'
    },
    allergens: ['Gluten', 'Dairy (Buttermilk, Butter)'],
    meal_type: 'lunch',
    total_quantity_planned: 250,
    cost_per_meal: 38.00,
    special_notes: 'Vegan option available without buttermilk and butter'
  },
  {
    date: '2025-09-28',
    meal_name: 'South Indian Special',
    description: 'Traditional South Indian meal with sambhar and coconut chutney',
    items: ['Steamed Rice', 'Sambhar', 'Rasam', 'Coconut Chutney', 'Vegetable Poriyal', 'Papadum'],
    nutritional_info: {
      calories: 420,
      protein: 16,
      carbohydrates: 62,
      fat: 14,
      fiber: 10,
      vitamins: 'Rich in Vitamin C, Folate, and antioxidants'
    },
    allergens: ['May contain mustard seeds', 'Coconut'],
    meal_type: 'lunch',
    total_quantity_planned: 250,
    cost_per_meal: 32.00,
    special_notes: 'Fresh coconut chutney made daily'
  },
  {
    date: '2025-09-29',
    meal_name: 'Punjabi Combo',
    description: 'North Indian style meal with rich flavors and wholesome nutrition',
    items: ['Jeera Rice', 'Chole Masala', 'Aloo Gobi', 'Tandoori Roti', 'Mint Chutney', 'Lassi'],
    nutritional_info: {
      calories: 520,
      protein: 20,
      carbohydrates: 75,
      fat: 16,
      fiber: 14,
      vitamins: 'High in protein, Vitamin E, and probiotics'
    },
    allergens: ['Gluten', 'Dairy (Lassi)', 'May contain nuts'],
    meal_type: 'lunch',
    total_quantity_planned: 250,
    cost_per_meal: 42.00,
    special_notes: 'Fresh tandoori roti from clay oven'
  },
  {
    date: '2025-09-30',
    meal_name: 'Bengali Fish Curry',
    description: 'Traditional Bengali fish curry with steamed rice and seasonal vegetables',
    items: ['Steamed Rice', 'Fish Curry (Rohu)', 'Aloo Posto', 'Dal', 'Mixed Vegetable', 'Fish Fry'],
    nutritional_info: {
      calories: 490,
      protein: 28,
      carbohydrates: 58,
      fat: 18,
      fiber: 8,
      vitamins: 'Rich in Omega-3, Protein, and Vitamin D'
    },
    allergens: ['Fish', 'May contain bones'],
    meal_type: 'lunch',
    total_quantity_planned: 200, // Fewer as it's non-vegetarian
    cost_per_meal: 55.00,
    special_notes: 'Vegetarian alternative: Paneer curry available'
  }
];

const sampleInventoryItems = [
  { item_name: 'Basmati Rice', category: 'grains', current_stock: 500, unit: 'kg', minimum_threshold: 50, cost_per_unit: 80, supplier_name: 'Rice Mills Co.', supplier_contact: '+91-9876543210' },
  { item_name: 'Toor Dal', category: 'grains', current_stock: 200, unit: 'kg', minimum_threshold: 25, cost_per_unit: 120, supplier_name: 'Dal Suppliers Ltd.', supplier_contact: '+91-9876543211' },
  { item_name: 'Potatoes', category: 'vegetables', current_stock: 150, unit: 'kg', minimum_threshold: 20, cost_per_unit: 25, supplier_name: 'Fresh Veggie Mart', supplier_contact: '+91-9876543212' },
  { item_name: 'Onions', category: 'vegetables', current_stock: 100, unit: 'kg', minimum_threshold: 15, cost_per_unit: 30, supplier_name: 'Fresh Veggie Mart', supplier_contact: '+91-9876543212' },
  { item_name: 'Tomatoes', category: 'vegetables', current_stock: 80, unit: 'kg', minimum_threshold: 10, cost_per_unit: 40, supplier_name: 'Fresh Veggie Mart', supplier_contact: '+91-9876543212' },
  { item_name: 'Cooking Oil', category: 'oils', current_stock: 25, unit: 'liters', minimum_threshold: 5, cost_per_unit: 150, supplier_name: 'Oil India', supplier_contact: '+91-9876543213' },
  { item_name: 'Turmeric Powder', category: 'spices', current_stock: 10, unit: 'kg', minimum_threshold: 2, cost_per_unit: 300, supplier_name: 'Spice Palace', supplier_contact: '+91-9876543214' },
  { item_name: 'Red Chili Powder', category: 'spices', current_stock: 8, unit: 'kg', minimum_threshold: 1, cost_per_unit: 250, supplier_name: 'Spice Palace', supplier_contact: '+91-9876543214' },
  { item_name: 'Cumin Seeds', category: 'spices', current_stock: 5, unit: 'kg', minimum_threshold: 1, cost_per_unit: 400, supplier_name: 'Spice Palace', supplier_contact: '+91-9876543214' },
  { item_name: 'Fresh Milk', category: 'dairy', current_stock: 50, unit: 'liters', minimum_threshold: 10, cost_per_unit: 60, supplier_name: 'Dairy Fresh', supplier_contact: '+91-9876543215', expiry_date: '2025-09-28' }
];

const seedMealData = async () => {
  try {
    console.log('🍽️ Starting Meal System Data Seeding...');
    
    // Connect to databases
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');
    
    // Get or create admin user for created_by field
    let admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) {
      console.log('⚠️ No admin user found. Creating admin user...');
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`✅ Created admin user: ${admin.email} (ID: ${admin.id})`);
    } else {
      console.log(`✅ Found existing admin user: ${admin.email} (ID: ${admin.id})`);
    }

    console.log('Seeding meal plans...');
    
    for (const mealData of sampleMealPlans) {
      try {
        const mealPlan = await MealPlan.create({
          ...mealData,
          created_by: admin.id
        });
        console.log(`✅ Created meal plan: ${mealPlan.meal_name} for ${mealPlan.date}`);
      } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
          console.log(`⚠️ Meal plan for ${mealData.date} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating meal plan for ${mealData.date}:`, err.message);
        }
      }
    }

    console.log('Seeding inventory items...');
    
    for (const itemData of sampleInventoryItems) {
      try {
        // Update stock status based on current_stock and minimum_threshold
        let status = 'available';
        if (itemData.current_stock <= 0) {
          status = 'out_of_stock';
        } else if (itemData.current_stock <= itemData.minimum_threshold) {
          status = 'low_stock';
        }
        
        const item = await InventoryItem.create({
          ...itemData,
          status,
          storage_location: 'Main Kitchen Store',
          last_purchased_date: new Date()
        });
        console.log(`✅ Created inventory item: ${item.item_name} (${item.current_stock} ${item.unit})`);
      } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
          console.log(`⚠️ Inventory item ${itemData.item_name} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating inventory item ${itemData.item_name}:`, err.message);
        }
      }
    }

    // Create some sample meal consumption records for today's meal
    console.log('Creating sample consumption records...');
    const todaysMeal = await MealPlan.findOne({ where: { date: '2025-09-26' } });
    if (todaysMeal) {
      const students = await Student.findAll({ limit: 10 });
      for (const student of students) {
        try {
          await MealConsumption.create({
            meal_plan_id: todaysMeal.id,
            student_id: student.id,
            quantity_consumed: 1.0,
            status: 'consumed',
            marked_by: admin.id,
            notes: 'Sample consumption record'
          });
        } catch (err) {
          // Ignore duplicate consumption records
        }
      }
      console.log(`✅ Created sample consumption records for ${students.length} students`);
    }

    // Create some sample feedback
    console.log('Creating sample feedback...');
    if (todaysMeal) {
      const students = await Student.findAll({ limit: 5 });
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        try {
          const feedback = new MealFeedback({
            mealPlanId: todaysMeal.id,
            studentId: student.id,
            rating: 4 + Math.floor(Math.random() * 2), // 4 or 5 stars
            feedback: [
              'Food was delicious and fresh!',
              'Loved the variety of items.',
              'Perfect quantity and taste.',
              'Great nutritional balance.',
              'Would love to have this again!'
            ][i],
            aspects: {
              taste: 4 + Math.floor(Math.random() * 2),
              hygiene: 5,
              quantity: 4 + Math.floor(Math.random() * 2),
              variety: 4 + Math.floor(Math.random() * 2)
            },
            feedbackType: 'student',
            isAnonymous: Math.random() > 0.5
          });
          
          await feedback.save();
        } catch (err) {
          // Ignore duplicates
        }
      }
      console.log(`✅ Created sample feedback from students`);
    }

    console.log('\n🎉 Meal System Data Seeded Successfully!\n');
    
    console.log('📊 Summary:');
    const mealPlanCount = await MealPlan.count();
    const inventoryCount = await InventoryItem.count();
    const consumptionCount = await MealConsumption.count();
    const feedbackCount = await MealFeedback.countDocuments();
    
    console.log(`📅 Meal Plans: ${mealPlanCount}`);
    console.log(`📦 Inventory Items: ${inventoryCount}`);
    console.log(`🍽️ Consumption Records: ${consumptionCount}`);
    console.log(`💬 Feedback Records: ${feedbackCount}`);
    
    console.log('\n📋 Sample Meal Plans Created:');
    const allMealPlans = await MealPlan.findAll({ 
      order: [['date', 'ASC']],
      attributes: ['date', 'meal_name', 'cost_per_meal']
    });
    
    allMealPlans.forEach(plan => {
      console.log(`   ${plan.date} - ${plan.meal_name} - ₹${plan.cost_per_meal}`);
    });

    console.log('\n🚨 Inventory Alerts:');
    const lowStockItems = await InventoryItem.findAll({
      where: { status: ['low_stock', 'out_of_stock'] },
      attributes: ['item_name', 'current_stock', 'unit', 'minimum_threshold', 'status']
    });
    
    if (lowStockItems.length > 0) {
      lowStockItems.forEach(item => {
        console.log(`   ⚠️ ${item.item_name}: ${item.current_stock} ${item.unit} (Threshold: ${item.minimum_threshold}) - ${item.status.toUpperCase()}`);
      });
    } else {
      console.log('   ✅ All items are adequately stocked');
    }

    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding meal data:', error);
    process.exit(1);
  }
};

seedMealData();
