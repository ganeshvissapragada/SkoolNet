const { Student } = require('../models/postgres');
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