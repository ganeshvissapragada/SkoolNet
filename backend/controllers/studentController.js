const Attendance = require('../models/mongo/attendance');
const Marks = require('../models/mongo/marks');
const { Scholarship, User, Student } = require('../models/postgres');

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