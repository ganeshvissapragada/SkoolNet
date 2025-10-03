const bcrypt = require('bcryptjs');
const { User, Student, Scholarship, MealPlan, InventoryItem, MealConsumption, Class, Subject, TeacherAssignment } = require('../models/postgres');
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
        parent_id: parent_id || null,
        user_id: created.id  // Link student to user account
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

// Get all users for admin management
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (e) {
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

// =================== TEACHER ASSIGNMENT MANAGEMENT ===================

// Create a new teacher assignment
exports.createTeacherAssignment = async (req, res) => {
  try {
    const { teacherId, classId, subjectId, academicYear, term, assignedBy } = req.body;

    if (!teacherId || !classId || !subjectId || !academicYear || !term) {
      return res.status(400).json({ message: 'Teacher ID, class ID, subject ID, academic year, and term are required' });
    }

    // Check if the assignment already exists
    const existingAssignment = await TeacherAssignment.findOne({
      where: { teacherId, classId, subjectId, academicYear, term }
    });

    if (existingAssignment) {
      return res.status(409).json({ message: 'Assignment already exists for the given teacher, class, subject, academic year, and term' });
    }

    const assignment = await TeacherAssignment.create({
      teacherId,
      classId,
      subjectId,
      academicYear,
      term,
      assignedBy: req.user.id // Admin who created the assignment
    });

    res.status(201).json(assignment);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Get all teacher assignments
exports.getTeacherAssignments = async (req, res) => {
  try {
    const assignments = await TeacherAssignment.findAll({
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Class, attributes: ['id', 'name'] },
        { model: Subject, attributes: ['id', 'name'] }
      ],
      order: [['academicYear', 'DESC'], ['term', 'DESC']]
    });

    res.json(assignments);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Get a specific teacher assignment by ID
exports.getTeacherAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await TeacherAssignment.findByPk(assignmentId, {
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Class, attributes: ['id', 'name'] },
        { model: Subject, attributes: ['id', 'name'] }
      ]
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Update a teacher assignment
exports.updateTeacherAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const assignment = await TeacherAssignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await assignment.update(updateData);

    const updatedAssignment = await TeacherAssignment.findByPk(assignmentId, {
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Class, attributes: ['id', 'name'] },
        { model: Subject, attributes: ['id', 'name'] }
      ]
    });

    res.json(updatedAssignment);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Class Management
exports.createClass = async (req, res) => {
  try {
    const { class_name, section } = req.body;
    
    if (!class_name || !section) {
      return res.status(400).json({ message: 'class_name and section are required' });
    }

    // Check if class already exists
    const existingClass = await Class.findOne({
      where: { class_name, section }
    });

    if (existingClass) {
      return res.status(409).json({ message: 'Class with this name and section already exists' });
    }

    const newClass = await Class.create({ class_name, section });
    
    res.status(201).json({
      message: 'Class created successfully',
      class: newClass
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [{
        model: Subject,
        as: 'Subjects',
        required: false
      }],
      order: [['class_name', 'ASC'], ['section', 'ASC']]
    });
    
    res.json(classes);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if class has associated subjects
    const subjectsCount = await Subject.count({
      where: { class_id: id }
    });

    if (subjectsCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete class that has subjects assigned. Please delete subjects first.' 
      });
    }

    const deleted = await Class.destroy({
      where: { id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({ message: 'Class deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Subject Management
exports.createSubject = async (req, res) => {
  try {
    const { name, class_id } = req.body;
    
    if (!name || !class_id) {
      return res.status(400).json({ message: 'name and class_id are required' });
    }

    // Check if class exists
    const classExists = await Class.findByPk(class_id);
    if (!classExists) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if subject already exists for this class
    const existingSubject = await Subject.findOne({
      where: { name, class_id }
    });

    if (existingSubject) {
      return res.status(409).json({ message: 'Subject already exists for this class' });
    }

    const newSubject = await Subject.create({ name, class_id });
    
    // Get the created subject with class info
    const subjectWithClass = await Subject.findByPk(newSubject.id, {
      include: [{
        model: Class,
        as: 'Class',
        attributes: ['id', 'class_name', 'section']
      }]
    });
    
    res.status(201).json({
      message: 'Subject created successfully',
      subject: subjectWithClass
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      include: [{
        model: Class,
        as: 'Class',
        attributes: ['id', 'class_name', 'section']
      }],
      order: [
        [{ model: Class, as: 'Class' }, 'class_name', 'ASC'],
        [{ model: Class, as: 'Class' }, 'section', 'ASC'],
        ['name', 'ASC']
      ]
    });
    
    res.json(subjects);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if subject has teacher assignments
    const assignmentsCount = await TeacherAssignment.count({
      where: { subject_id: id, is_active: true }
    });

    if (assignmentsCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete subject that has teacher assignments. Please remove assignments first.' 
      });
    }

    const deleted = await Subject.destroy({
      where: { id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Teacher Assignment Management
exports.getClassesAndSubjects = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [{
        model: Subject,
        as: 'Subjects',
        required: false
      }],
      order: [['class_name', 'ASC'], [{ model: Subject, as: 'Subjects' }, 'name', 'ASC']]
    });
    
    res.json(classes);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.findAll({
      where: { role: 'teacher' },
      attributes: ['id', 'name', 'email'],
      order: [['name', 'ASC']]
    });
    
    res.json(teachers);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.createTeacherAssignment = async (req, res) => {
  try {
    const { teacher_id, class_id, subject_id, academic_year } = req.body;
    
    if (!teacher_id || !class_id || !subject_id) {
      return res.status(400).json({ message: 'teacher_id, class_id, and subject_id are required' });
    }

    // Check if assignment already exists
    const existingAssignment = await TeacherAssignment.findOne({
      where: {
        teacher_id,
        class_id,
        subject_id,
        academic_year: academic_year || new Date().getFullYear().toString(),
        is_active: true
      }
    });

    if (existingAssignment) {
      return res.status(409).json({ message: 'Teacher is already assigned to this class and subject' });
    }

    const assignment = await TeacherAssignment.create({
      teacher_id,
      class_id,
      subject_id,
      academic_year: academic_year || new Date().getFullYear().toString()
    });

    const assignmentWithDetails = await TeacherAssignment.findByPk(assignment.id, {
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Class, as: 'class', attributes: ['id', 'class_name', 'section'] },
        { model: Subject, as: 'subject', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Teacher assignment created successfully',
      assignment: assignmentWithDetails
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getTeacherAssignments = async (req, res) => {
  try {
    const { academic_year } = req.query;
    const whereClause = { is_active: true };
    
    if (academic_year) {
      whereClause.academic_year = academic_year;
    }

    const assignments = await TeacherAssignment.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Class, as: 'class', attributes: ['id', 'class_name', 'section'] },
        { model: Subject, as: 'subject', attributes: ['id', 'name'] }
      ],
      order: [
        [{ model: User, as: 'teacher' }, 'name', 'ASC'],
        [{ model: Class, as: 'class' }, 'class_name', 'ASC'],
        [{ model: Subject, as: 'subject' }, 'name', 'ASC']
      ]
    });

    res.json(assignments);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.updateTeacherAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { teacher_id, class_id, subject_id, academic_year, is_active } = req.body;

    const assignment = await TeacherAssignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check for duplicate if updating teacher/class/subject
    if (teacher_id || class_id || subject_id) {
      const checkData = {
        teacher_id: teacher_id || assignment.teacher_id,
        class_id: class_id || assignment.class_id,
        subject_id: subject_id || assignment.subject_id,
        academic_year: academic_year || assignment.academic_year,
        is_active: true
      };

      const existingAssignment = await TeacherAssignment.findOne({
        where: {
          ...checkData,
          id: { [Op.ne]: assignmentId }
        }
      });

      if (existingAssignment) {
        return res.status(409).json({ message: 'Teacher is already assigned to this class and subject' });
      }
    }

    await assignment.update({
      teacher_id: teacher_id || assignment.teacher_id,
      class_id: class_id || assignment.class_id,
      subject_id: subject_id || assignment.subject_id,
      academic_year: academic_year || assignment.academic_year,
      is_active: is_active !== undefined ? is_active : assignment.is_active
    });

    const updatedAssignment = await TeacherAssignment.findByPk(assignmentId, {
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Class, as: 'class', attributes: ['id', 'class_name', 'section'] },
        { model: Subject, as: 'subject', attributes: ['id', 'name'] }
      ]
    });

    res.json({
      success: true,
      message: 'Teacher assignment updated successfully',
      assignment: updatedAssignment
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.deleteTeacherAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await TeacherAssignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await assignment.update({ is_active: false });

    res.json({
      success: true,
      message: 'Teacher assignment removed successfully'
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Attendance Management
exports.getAttendanceData = async (req, res) => {
  try {
    const { teacher_id, class_name, section, student_id, date_from, date_to } = req.query;
    
    // Import the Attendance model from MongoDB
    const Attendance = require('../models/mongo/attendance');
    
    // Build query filters
    const filters = {};
    
    if (student_id) {
      filters.studentId = parseInt(student_id);
    }
    
    if (date_from || date_to) {
      filters.date = {};
      if (date_from) filters.date.$gte = new Date(date_from);
      if (date_to) filters.date.$lte = new Date(date_to);
    }
    
    // Get attendance records
    let attendanceRecords = await Attendance.find(filters).sort({ date: -1 });
    
    // Get student details to filter by class/section/teacher
    let studentIds = [...new Set(attendanceRecords.map(record => record.studentId))];
    
    if (studentIds.length === 0) {
      return res.json({
        records: [],
        stats: {
          total: 0,
          present: 0,
          absent: 0,
          presentPercentage: 0
        }
      });
    }
    
    const students = await Student.findAll({
      where: {
        id: studentIds
      },
      include: [
        { model: User, as: 'student_user', attributes: ['id', 'name'] }
      ]
    });
    
    // Filter by class and section if provided
    let filteredStudents = students;
    if (class_name) {
      filteredStudents = filteredStudents.filter(s => s.class === class_name);
    }
    if (section) {
      filteredStudents = filteredStudents.filter(s => s.section === section);
    }
    
    // If teacher_id is provided, filter by teacher assignments
    if (teacher_id) {
      const teacherAssignments = await TeacherAssignment.findAll({
        where: {
          teacher_id: parseInt(teacher_id),
          is_active: true
        },
        include: [
          { model: Class, as: 'class' }
        ]
      });
      
      const assignedClassSections = teacherAssignments.map(ta => ({
        class_name: ta.class.class_name,
        section: ta.class.section
      }));
      
      filteredStudents = filteredStudents.filter(student => 
        assignedClassSections.some(cs => 
          cs.class_name === student.class && cs.section === student.section
        )
      );
    }
    
    const filteredStudentIds = filteredStudents.map(s => s.id);
    
    // Filter attendance records by the filtered students
    attendanceRecords = attendanceRecords.filter(record => 
      filteredStudentIds.includes(record.studentId)
    );
    
    // Enrich attendance records with student info
    const enrichedRecords = attendanceRecords.map(record => {
      const student = students.find(s => s.id === record.studentId);
      return {
        ...record.toObject(),
        student: {
          id: student?.id,
          name: student?.name || student?.student_user?.name,
          class: student?.class,
          section: student?.section
        }
      };
    });
    
    // Calculate statistics
    const stats = {
      total: enrichedRecords.length,
      present: enrichedRecords.filter(r => r.status === 'Present').length,
      absent: enrichedRecords.filter(r => r.status === 'Absent').length
    };
    stats.presentPercentage = stats.total > 0 ? 
      Math.round((stats.present / stats.total) * 100) : 0;
    
    res.json({
      records: enrichedRecords,
      stats,
      filters: {
        teacher_id,
        class_name,
        section,
        student_id,
        date_from,
        date_to
      }
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
