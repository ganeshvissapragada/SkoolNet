const Attendance = require('../models/mongo/attendance');
const Marks = require('../models/mongo/marks');

exports.addAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    if (!studentId || !date || !status) return res.status(400).json({ message: 'studentId, date, status required' });
    const doc = await Attendance.create({ studentId: Number(studentId), date, status });
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.addMarks = async (req, res) => {
  try {
    const { studentId, subjectId, marksObtained, totalMarks, examType, date } = req.body;
    if (!studentId || !subjectId || marksObtained == null || totalMarks == null || !examType) {
      return res.status(400).json({ message: 'studentId, subjectId, marksObtained, totalMarks, examType required' });
    }
    const doc = await Marks.create({
      studentId: Number(studentId),
      subjectId: Number(subjectId),
      marksObtained: Number(marksObtained),
      totalMarks: Number(totalMarks),
      examType,
      date: date || new Date()
    });
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};