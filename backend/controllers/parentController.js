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