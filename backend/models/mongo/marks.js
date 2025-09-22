const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema(
  {
    studentId: { type: Number, required: true }, // maps to Postgres Students.id
    subjectId: { type: Number, required: true }, // maps to Postgres Subjects.id
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    examType: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Marks', marksSchema);