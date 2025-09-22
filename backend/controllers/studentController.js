const Attendance = require('../models/mongo/attendance');
const Marks = require('../models/mongo/marks');

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