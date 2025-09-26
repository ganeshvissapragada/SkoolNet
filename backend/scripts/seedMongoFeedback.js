require('dotenv').config();
const mongoose = require('mongoose');
const MealFeedback = require('../models/mongo/mealFeedback');

const sampleFeedbacks = [
  {
    mealPlanId: 1, // Vegetarian Thali
    studentId: 1,
    rating: 5,
    feedback: 'The vegetarian thali was absolutely delicious! Perfect balance of flavors and very filling.',
    aspects: {
      taste: 5,
      hygiene: 5,
      quantity: 4,
      variety: 5
    },
    feedbackType: 'student',
    isAnonymous: false
  },
  {
    mealPlanId: 1,
    studentId: 2,
    parentId: 1,
    rating: 4,
    feedback: 'My child loved the dal tadka and rice. The vegetables were fresh and well-cooked.',
    aspects: {
      taste: 4,
      hygiene: 5,
      quantity: 4,
      variety: 4
    },
    feedbackType: 'parent',
    isAnonymous: false
  },
  {
    mealPlanId: 2, // Rajma Rice Bowl
    studentId: 3,
    rating: 5,
    feedback: 'Rajma rice is my favorite! The portion was perfect and taste was excellent.',
    aspects: {
      taste: 5,
      hygiene: 4,
      quantity: 5,
      variety: 4
    },
    feedbackType: 'student',
    isAnonymous: true
  },
  {
    mealPlanId: 3, // South Indian Special
    studentId: 1,
    rating: 4,
    feedback: 'Loved the sambar and rasam combination. The idli was soft and fresh.',
    aspects: {
      taste: 4,
      hygiene: 5,
      quantity: 4,
      variety: 5
    },
    feedbackType: 'student',
    isAnonymous: false
  },
  {
    mealPlanId: 4, // Punjabi Combo
    studentId: 2,
    parentId: 2,
    rating: 3,
    feedback: 'The chole was a bit too spicy for my child, but the naan was good.',
    aspects: {
      taste: 3,
      hygiene: 4,
      quantity: 4,
      variety: 4
    },
    feedbackType: 'parent',
    isAnonymous: false
  },
  {
    mealPlanId: 5, // Bengali Fish Curry
    studentId: 3,
    rating: 5,
    feedback: 'Amazing fish curry! Never had such tasty school meal before. More Bengali dishes please!',
    aspects: {
      taste: 5,
      hygiene: 5,
      quantity: 4,
      variety: 5
    },
    feedbackType: 'student',
    isAnonymous: false
  }
];

const seedMongoFeedback = async () => {
  try {
    console.log('🍽️ Starting MongoDB Meal Feedback Seeding...');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing feedback
    await MealFeedback.deleteMany({});
    console.log('🧹 Cleared existing feedback data');
    
    // Insert sample feedbacks
    for (const feedbackData of sampleFeedbacks) {
      const feedback = new MealFeedback(feedbackData);
      await feedback.save();
      console.log(`✅ Created feedback: ${feedback.rating}/5 stars for meal ${feedback.mealPlanId} by ${feedback.feedbackType}`);
    }
    
    console.log('\n🎉 MongoDB Meal Feedback Seeded Successfully!');
    
    // Summary
    const totalFeedback = await MealFeedback.countDocuments();
    const avgRating = await MealFeedback.aggregate([
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);
    
    console.log(`\n📊 Summary:`);
    console.log(`📝 Total Feedback Records: ${totalFeedback}`);
    console.log(`⭐ Average Rating: ${avgRating[0]?.averageRating.toFixed(1)}/5.0`);
    
    // Feedback by meal
    const feedbackByMeal = await MealFeedback.aggregate([
      { 
        $group: { 
          _id: '$mealPlanId', 
          count: { $sum: 1 }, 
          avgRating: { $avg: '$rating' } 
        } 
      },
      { $sort: { _id: 1 } }
    ]);
    
    console.log(`\n📋 Feedback by Meal Plan:`);
    feedbackByMeal.forEach(meal => {
      console.log(`   Meal Plan ${meal._id}: ${meal.count} feedbacks, Avg: ${meal.avgRating.toFixed(1)}/5`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding MongoDB feedback:', error);
    process.exit(1);
  }
};

seedMongoFeedback();
