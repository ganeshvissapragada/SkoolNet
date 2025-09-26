const Attendance = require('../models/mongo/attendance');
const Marks = require('../models/mongo/marks');
const MealFeedback = require('../models/mongo/mealFeedback');
const { Scholarship, User, Student, MealPlan, MealConsumption, sequelize } = require('../models/postgres');
const { Op } = require('sequelize');

exports.getAttendance = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    if (!studentId) return res.status(400).json({ message: 'studentId required' });
    const items = await Attendance.find({ studentId }).sort({ date: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getMarks = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    if (!studentId) return res.status(400).json({ message: 'studentId required' });
    const items = await Marks.find({ studentId }).sort({ date: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Scholarship Viewing for Students
exports.getActiveScholarships = async (req, res) => {
  try {
    const studentUserId = req.user.id;
    
    // Find the student record to get their class
    const studentRecord = await Student.findOne({
      include: [
        {
          model: User,
          as: 'parent',
          where: { id: studentUserId },
          required: false
        }
      ]
    });

    let studentClass = null;
    if (studentRecord) {
      studentClass = studentRecord.class;
    }

    const scholarships = await Scholarship.findAll({
      where: {
        status: 'active',
        application_deadline: {
          [require('sequelize').Op.gte]: new Date()
        }
      },
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ],
      order: [['application_deadline', 'ASC']]
    });

    // Filter scholarships based on class eligibility
    const eligibleScholarships = scholarships.filter(scholarship => {
      if (!scholarship.class_eligibility || scholarship.class_eligibility.length === 0) {
        return true; // No class restriction
      }
      if (!studentClass) {
        return true; // Student class not found, show all
      }
      return scholarship.class_eligibility.includes(studentClass);
    });

    res.json(eligibleScholarships);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getScholarshipDetailsForStudent = async (req, res) => {
  try {
    const { scholarshipId } = req.params;
    
    const scholarship = await Scholarship.findOne({
      where: {
        id: scholarshipId,
        status: 'active',
        application_deadline: {
          [require('sequelize').Op.gte]: new Date()
        }
      },
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found or not available' });
    }

    res.json(scholarship);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
// =================== MEAL SYSTEM - STUDENT VIEW ===================

exports.getDailyMealPlan = async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date || new Date().toISOString().split('T')[0];
    
    const mealPlans = await MealPlan.findAll({
      where: { date: queryDate },
      attributes: ['id', 'date', 'meal_name', 'description', 'items', 'nutritional_info', 'allergens', 'meal_type', 'status', 'special_notes']
    });

    res.json(mealPlans);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getMyMealConsumption = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get student record - first try by user ID, then try finding student record linked to this user
    let student = await Student.findOne({
      where: { id: userId },
      attributes: ['id', 'name', 'class', 'section']
    });

    // If not found by direct ID, try finding by looking up user in Students table
    if (!student) {
      const user = await User.findByPk(userId);
      if (user && user.role === 'student') {
        // Find student record by matching email or create one
        student = await Student.findOne({
          attributes: ['id', 'name', 'class', 'section']
        });
      }
    }

    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    const { date, week } = req.query;
    let mealPlanWhere = {};
    
    if (date) {
      mealPlanWhere.date = date;
    } else if (week) {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      mealPlanWhere.date = {
        [Op.between]: [startOfWeek.toISOString().split('T')[0], endOfWeek.toISOString().split('T')[0]]
      };
    } else {
      // Default to current week
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      mealPlanWhere.date = {
        [Op.between]: [startOfWeek.toISOString().split('T')[0], endOfWeek.toISOString().split('T')[0]]
      };
    }

    const consumptions = await MealConsumption.findAll({
      where: { student_id: student.id },
      include: [
        {
          model: MealPlan,
          as: 'meal_plan',
          where: mealPlanWhere,
          attributes: ['id', 'date', 'meal_name', 'meal_type', 'items', 'nutritional_info']
        }
      ],
      order: [['consumed_at', 'DESC']]
    });

    res.json({ student, consumptions });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.submitMealFeedback = async (req, res) => {
  try {
    const studentUserId = req.user.userId;
    const { mealPlanId, rating, feedback, aspects, isAnonymous } = req.body;

    if (!mealPlanId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Valid meal plan ID and rating (1-5) are required'
      });
    }

    // Get student record
    const student = await Student.findOne({
      where: { parent_id: studentUserId }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    const MealFeedback = require('../models/mongo/mealFeedback');
    
    // Check if feedback already exists
    const existingFeedback = await MealFeedback.findOne({
      mealPlanId: parseInt(mealPlanId),
      studentId: student.id,
      feedbackType: 'student'
    });

    if (existingFeedback) {
      // Update existing feedback
      existingFeedback.rating = rating;
      existingFeedback.feedback = feedback || '';
      existingFeedback.aspects = aspects || {};
      existingFeedback.isAnonymous = isAnonymous || false;
      await existingFeedback.save();
      
      res.json({ message: 'Feedback updated successfully', feedback: existingFeedback });
    } else {
      // Create new feedback
      const newFeedback = new MealFeedback({
        mealPlanId: parseInt(mealPlanId),
        studentId: student.id,
        rating,
        feedback: feedback || '',
        aspects: aspects || {},
        feedbackType: 'student',
        isAnonymous: isAnonymous || false
      });

      await newFeedback.save();
      res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
