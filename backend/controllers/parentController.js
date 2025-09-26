const { Student, PTM, User, Scholarship } = require('../models/postgres');
const Attendance = require('../models/mongo/attendance');
const Marks = require('../models/mongo/marks');

exports.getChildAttendance = async (req, res) => {
  try {
    const parentId = Number(req.params.parentId);
    if (!parentId) return res.status(400).json({ message: 'parentId required' });
    const student = await Student.findOne({ where: { parent_id: parentId } });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const items = await Attendance.find({ studentId: student.id }).sort({ date: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getChildMarks = async (req, res) => {
  try {
    const parentId = Number(req.params.parentId);
    if (!parentId) return res.status(400).json({ message: 'parentId required' });
    const student = await Student.findOne({ where: { parent_id: parentId } });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const items = await Marks.find({ studentId: student.id }).sort({ date: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// PTM Management for Parents
exports.getParentPTMs = async (req, res) => {
  try {
    const parentId = req.user.id;
    const { status } = req.query;
    
    const whereClause = { parent_id: parentId };
    if (status) {
      whereClause.status = status;
    }

    const ptms = await PTM.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Student, as: 'student', attributes: ['id', 'name', 'class', 'section'] }
      ],
      order: [['meeting_date', 'ASC'], ['meeting_time', 'ASC']]
    });

    res.json(ptms);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.confirmPTM = async (req, res) => {
  try {
    const { ptmId } = req.params;
    const parentId = req.user.id;

    const ptm = await PTM.findOne({
      where: { id: ptmId, parent_id: parentId }
    });

    if (!ptm) {
      return res.status(404).json({ message: 'PTM not found' });
    }

    if (ptm.status !== 'scheduled') {
      return res.status(400).json({ 
        message: 'PTM can only be confirmed if it is in scheduled status' 
      });
    }

    await ptm.update({ status: 'confirmed' });

    const updatedPTM = await PTM.findByPk(ptm.id, {
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Student, as: 'student', attributes: ['id', 'name', 'class', 'section'] }
      ]
    });

    res.json(updatedPTM);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getPTMDetails = async (req, res) => {
  try {
    const { ptmId } = req.params;
    const parentId = req.user.id;

    const ptm = await PTM.findOne({
      where: { id: ptmId, parent_id: parentId },
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Student, as: 'student', attributes: ['id', 'name', 'class', 'section'] }
      ]
    });

    if (!ptm) {
      return res.status(404).json({ message: 'PTM not found' });
    }

    res.json(ptm);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Scholarship Viewing for Parents
exports.getActiveScholarships = async (req, res) => {
  try {
    const parentId = req.user.id;
    
    // Get parent's children to determine eligible scholarships
    const children = await Student.findAll({
      where: { parent_id: parentId }
    });

    if (children.length === 0) {
      return res.json([]);
    }

    // Get all child classes for eligibility checking
    const childClasses = children.map(child => child.class).filter(Boolean);

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
      return scholarship.class_eligibility.some(eligibleClass => 
        childClasses.includes(eligibleClass)
      );
    });

    res.json(eligibleScholarships);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getScholarshipDetailsForParent = async (req, res) => {
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
// =================== MEAL SYSTEM - PARENT VIEW ===================

exports.getDailyMealPlan = async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date || new Date().toISOString().split('T')[0];
    
    const mealPlan = await MealPlan.findOne({
      where: { date: queryDate },
      attributes: ['id', 'date', 'meal_name', 'description', 'items', 'nutritional_info', 'allergens', 'meal_type', 'special_notes']
    });

    if (!mealPlan) {
      return res.status(404).json({ message: 'No meal plan found for this date' });
    }

    res.json(mealPlan);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getChildMealConsumption = async (req, res) => {
  try {
    const parentId = req.user.userId;
    
    // Get parent's children
    const children = await Student.findAll({
      where: { parent_id: parentId },
      attributes: ['id', 'name', 'class', 'section']
    });

    if (children.length === 0) {
      return res.json({ message: 'No children found', consumptions: [] });
    }

    const childIds = children.map(child => child.id);
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
      where: { student_id: { [Op.in]: childIds } },
      include: [
        {
          model: MealPlan,
          as: 'meal_plan',
          where: mealPlanWhere,
          attributes: ['id', 'date', 'meal_name', 'meal_type']
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'class', 'section']
        }
      ],
      order: [['consumed_at', 'DESC']]
    });

    res.json({ children, consumptions });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.submitMealFeedback = async (req, res) => {
  try {
    const parentId = req.user.userId;
    const { mealPlanId, studentId, rating, feedback, aspects, isAnonymous } = req.body;

    if (!mealPlanId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Valid meal plan ID and rating (1-5) are required'
      });
    }

    // Verify parent has access to this student
    const student = await Student.findOne({
      where: { id: studentId, parent_id: parentId }
    });

    if (!student) {
      return res.status(403).json({ message: 'Access denied to this student' });
    }

    const MealFeedback = require('../models/mongo/mealFeedback');
    
    // Check if feedback already exists
    const existingFeedback = await MealFeedback.findOne({
      mealPlanId: parseInt(mealPlanId),
      studentId: parseInt(studentId),
      parentId: parentId,
      feedbackType: 'parent'
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
        studentId: parseInt(studentId),
        parentId: parentId,
        rating,
        feedback: feedback || '',
        aspects: aspects || {},
        feedbackType: 'parent',
        isAnonymous: isAnonymous || false
      });

      await newFeedback.save();
      res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
