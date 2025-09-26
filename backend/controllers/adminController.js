const bcrypt = require('bcryptjs');
const { User, Student, Scholarship } = require('../models/postgres');

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