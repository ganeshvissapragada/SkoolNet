const bcrypt = require('bcryptjs');
const { User, Student, Scholarship, MealPlan, InventoryItem, MealConsumption } = require('../models/postgres');
const { Op } = require('sequelize');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, student } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'name, email, password, role required' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const created = await User.create({ name, email, password: hashed, role });

    let studentRow = null;
    if (role === 'student') {
      const { class: cls, section, parent_id } = student || {};
      studentRow = await Student.create({
        name,
        class: cls || null,
        section: section || null,
        parent_id: parent_id || null
      });
    }
    res.status(201).json({ user: { id: created.id, name, email, role }, student: studentRow });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: e.message });
  }
};

// Scholarship Management
exports.createScholarship = async (req, res) => {
  try {
    const {
      title,
      description,
      eligibility_criteria,
      scholarship_amount,
      currency = 'INR',
      benefits,
      required_documents,
      application_deadline,
      contact_person,
      contact_email,
      contact_phone,
      department,
      application_start_date,
      max_applications,
      scholarship_type = 'merit',
      class_eligibility
    } = req.body;

    // Validation
    if (!title || !eligibility_criteria || !scholarship_amount || !required_documents || 
        !application_deadline || !contact_person || !contact_email) {
      return res.status(400).json({ 
        message: 'title, eligibility_criteria, scholarship_amount, required_documents, application_deadline, contact_person, and contact_email are required' 
      });
    }

    // Validate required_documents is an array
    if (!Array.isArray(required_documents) || required_documents.length === 0) {
      return res.status(400).json({ 
        message: 'required_documents must be a non-empty array' 
      });
    }

    // Validate application deadline is in the future
    const deadlineDate = new Date(application_deadline);
    if (deadlineDate <= new Date()) {
      return res.status(400).json({ 
        message: 'Application deadline must be in the future' 
      });
    }

    const scholarship = await Scholarship.create({
      title,
      description,
      eligibility_criteria,
      scholarship_amount: parseFloat(scholarship_amount),
      currency,
      benefits,
      required_documents,
      application_deadline: deadlineDate,
      contact_person,
      contact_email,
      contact_phone,
      department,
      created_by: req.user.id,
      application_start_date: application_start_date ? new Date(application_start_date) : new Date(),
      max_applications,
      scholarship_type,
      class_eligibility
    });

    const scholarshipWithCreator = await Scholarship.findByPk(scholarship.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(201).json(scholarshipWithCreator);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getScholarships = async (req, res) => {
  try {
    const { status, scholarship_type } = req.query;
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    if (scholarship_type) {
      whereClause.scholarship_type = scholarship_type;
    }

    const scholarships = await Scholarship.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ],
      order: [['application_deadline', 'ASC']]
    });

    res.json(scholarships);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getScholarshipById = async (req, res) => {
  try {
    const { scholarshipId } = req.params;
    
    const scholarship = await Scholarship.findByPk(scholarshipId, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    res.json(scholarship);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.updateScholarship = async (req, res) => {
  try {
    const { scholarshipId } = req.params;
    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_by;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Validate application deadline if provided
    if (updateData.application_deadline) {
      const deadlineDate = new Date(updateData.application_deadline);
      if (deadlineDate <= new Date()) {
        return res.status(400).json({ 
          message: 'Application deadline must be in the future' 
        });
      }
      updateData.application_deadline = deadlineDate;
    }

    // Parse scholarship amount if provided
    if (updateData.scholarship_amount) {
      updateData.scholarship_amount = parseFloat(updateData.scholarship_amount);
    }

    const scholarship = await Scholarship.findByPk(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    await scholarship.update(updateData);

    const updatedScholarship = await Scholarship.findByPk(scholarshipId, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json(updatedScholarship);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.deleteScholarship = async (req, res) => {
  try {
    const { scholarshipId } = req.params;
    
    const scholarship = await Scholarship.findByPk(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    await scholarship.destroy();
    res.json({ message: 'Scholarship deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.toggleScholarshipStatus = async (req, res) => {
  try {
    const { scholarshipId } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'expired'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: active, inactive, expired' 
      });
    }

    const scholarship = await Scholarship.findByPk(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    await scholarship.update({ status });

    const updatedScholarship = await Scholarship.findByPk(scholarshipId, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json(updatedScholarship);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
// =================== MEAL SYSTEM MANAGEMENT ===================

// Meal Plan Management
exports.createMealPlan = async (req, res) => {
  try {
    const {
      date,
      meal_name,
      description,
      items,
      nutritional_info,
      allergens,
      meal_type,
      total_quantity_planned,
      cost_per_meal,
      special_notes
    } = req.body;

    if (!date || !meal_name || !items || !total_quantity_planned || !cost_per_meal) {
      return res.status(400).json({
        message: 'Date, meal name, items, quantity, and cost are required'
      });
    }

    const existingPlan = await MealPlan.findOne({
      where: { date, meal_type: meal_type || 'lunch' }
    });

    if (existingPlan) {
      return res.status(400).json({
        message: `Meal plan already exists for ${date} (${meal_type || 'lunch'})`
      });
    }

    // Ensure we have a valid user ID (JWT payload stores it as 'id')
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    const mealPlan = await MealPlan.create({
      date,
      meal_name,
      description,
      items: Array.isArray(items) ? items : [items],
      nutritional_info: nutritional_info || {},
      allergens: allergens || [],
      meal_type: meal_type || 'lunch',
      total_quantity_planned: parseInt(total_quantity_planned),
      cost_per_meal: parseFloat(cost_per_meal),
      created_by: userId,
      special_notes
    });

    const mealPlanWithCreator = await MealPlan.findByPk(mealPlan.id, {
      include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json(mealPlanWithCreator);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getMealPlans = async (req, res) => {
  try {
    const { date, status } = req.query;
    let whereClause = {};

    if (date) {
      whereClause.date = date;
    }

    if (status) {
      whereClause.status = status;
    }

    const mealPlans = await MealPlan.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ],
      order: [['date', 'DESC'], ['meal_type', 'ASC']]
    });

    res.json(mealPlans);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getMealDashboard = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const todaysMeal = await MealPlan.findOne({
      where: { date: today },
      include: [{ model: User, as: 'creator', attributes: ['id', 'name'] }]
    });

    let consumptionStats = { totalServed: 0, consumedCount: 0, notConsumedCount: 0 };
    if (todaysMeal) {
      const consumptions = await MealConsumption.findAll({
        where: { meal_plan_id: todaysMeal.id }
      });
      
      consumptionStats = {
        totalServed: consumptions.length,
        consumedCount: consumptions.filter(c => c.status === 'consumed').length,
        partialCount: consumptions.filter(c => c.status === 'partial').length,
        notConsumedCount: consumptions.filter(c => c.status === 'not_consumed').length,
        absentCount: consumptions.filter(c => c.status === 'absent').length
      };
    }

    const lowStockItems = await InventoryItem.findAll({
      where: {
        [Op.or]: [
          { status: 'low_stock' },
          { status: 'out_of_stock' }
        ]
      },
      limit: 10
    });

    res.json({
      todaysMeal,
      consumptionStats,
      lowStockItems,
      alertsCount: lowStockItems.length
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Get meal feedback for a specific meal plan
exports.getMealFeedback = async (req, res) => {
  try {
    const { mealPlanId } = req.params;
    const MealFeedback = require('../models/mongo/mealFeedback');
    
    const feedbacks = await MealFeedback.find({ mealPlanId })
      .sort({ createdAt: -1 });
    
    // Calculate statistics
    const stats = {
      totalFeedbacks: feedbacks.length,
      averageRating: feedbacks.length > 0 ? 
        feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length : 0,
      aspectAverages: {
        taste: feedbacks.length > 0 ? 
          feedbacks.reduce((sum, f) => sum + (f.aspects.taste || 0), 0) / feedbacks.length : 0,
        hygiene: feedbacks.length > 0 ? 
          feedbacks.reduce((sum, f) => sum + (f.aspects.hygiene || 0), 0) / feedbacks.length : 0,
        quantity: feedbacks.length > 0 ? 
          feedbacks.reduce((sum, f) => sum + (f.aspects.quantity || 0), 0) / feedbacks.length : 0,
        variety: feedbacks.length > 0 ? 
          feedbacks.reduce((sum, f) => sum + (f.aspects.variety || 0), 0) / feedbacks.length : 0
      },
      ratingDistribution: {
        1: feedbacks.filter(f => f.rating === 1).length,
        2: feedbacks.filter(f => f.rating === 2).length,
        3: feedbacks.filter(f => f.rating === 3).length,
        4: feedbacks.filter(f => f.rating === 4).length,
        5: feedbacks.filter(f => f.rating === 5).length
      }
    };
    
    res.json({
      feedbacks,
      stats
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Get all meal feedback with analytics
exports.getAllMealFeedback = async (req, res) => {
  try {
    const MealFeedback = require('../models/mongo/mealFeedback');
    const { MealPlan } = require('../models/postgres');
    
    const feedbacks = await MealFeedback.find()
      .sort({ createdAt: -1 })
      .limit(100); // Limit for performance
    
    // Get meal plan names for context
    const mealPlanIds = [...new Set(feedbacks.map(f => f.mealPlanId))];
    const mealPlans = await MealPlan.findAll({
      where: { id: mealPlanIds },
      attributes: ['id', 'meal_name', 'date']
    });
    
    const mealPlanMap = {};
    mealPlans.forEach(plan => {
      mealPlanMap[plan.id] = plan;
    });
    
    // Add meal plan info to feedbacks
    const enrichedFeedbacks = feedbacks.map(feedback => ({
      ...feedback.toObject(),
      mealPlan: mealPlanMap[feedback.mealPlanId]
    }));
    
    // Overall statistics
    const overallStats = {
      totalFeedbacks: feedbacks.length,
      averageRating: feedbacks.length > 0 ? 
        feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length : 0,
      feedbackByType: {
        student: feedbacks.filter(f => f.feedbackType === 'student').length,
        parent: feedbacks.filter(f => f.feedbackType === 'parent').length
      }
    };
    
    res.json({
      feedbacks: enrichedFeedbacks,
      stats: overallStats
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
