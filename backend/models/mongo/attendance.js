const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    studentId: { type: Number, required: true }, // maps to Postgres Students.id
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);