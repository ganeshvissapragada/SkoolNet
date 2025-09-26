const mongoose = require('mongoose');

const mealFeedbackSchema = new mongoose.Schema({
  mealPlanId: {
    type: Number,
    required: true,
    index: true
  },
  studentId: {
    type: Number,
    required: true,
    index: true
  },
  parentId: {
    type: Number,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    maxLength: 500
  },
  aspects: {
    taste: { type: Number, min: 1, max: 5 },
    hygiene: { type: Number, min: 1, max: 5 },
    quantity: { type: Number, min: 1, max: 5 },
    variety: { type: Number, min: 1, max: 5 }
  },
  feedbackType: {
    type: String,
    enum: ['student', 'parent'],
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'acknowledged'],
    default: 'active'
  },
  adminResponse: {
    message: String,
    respondedBy: Number,
    respondedAt: Date
  }
}, {
  timestamps: true,
  collection: 'meal_feedback'
});

// Compound indexes for efficient queries
mealFeedbackSchema.index({ mealPlanId: 1, createdAt: -1 });
mealFeedbackSchema.index({ studentId: 1, createdAt: -1 });
mealFeedbackSchema.index({ rating: 1, createdAt: -1 });

module.exports = mongoose.model('MealFeedback', mealFeedbackSchema);
