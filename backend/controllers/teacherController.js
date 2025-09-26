const Attendance = require('../models/mongo/attendance');
const Marks = require('../models/mongo/marks');
const { PTM, User, Student } = require('../models/postgres');

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

// PTM Management
exports.schedulePTM = async (req, res) => {
  try {
    const { 
      parent_id, 
      student_id, 
      meeting_date, 
      meeting_time, 
      duration = 30, 
      reason, 
      agenda, 
      location 
    } = req.body;
    
    if (!parent_id || !student_id || !meeting_date || !meeting_time || !reason) {
      return res.status(400).json({ 
        message: 'parent_id, student_id, meeting_date, meeting_time, and reason are required' 
      });
    }

    // Verify that the parent is actually the parent of the student
    const student = await Student.findOne({ 
      where: { id: student_id, parent_id: parent_id },
      include: [{ model: User, as: 'parent' }]
    });
    
    if (!student) {
      return res.status(404).json({ 
        message: 'Student not found or parent relationship not valid' 
      });
    }

    // Check if teacher has conflicting meetings
    const conflictingMeeting = await PTM.findOne({
      where: {
        teacher_id: req.user.id,
        meeting_date: meeting_date,
        meeting_time: meeting_time,
        status: ['scheduled', 'confirmed']
      }
    });

    if (conflictingMeeting) {
      return res.status(400).json({ 
        message: 'You already have a meeting scheduled at this time' 
      });
    }

    const ptm = await PTM.create({
      teacher_id: req.user.id,
      parent_id,
      student_id,
      meeting_date,
      meeting_time,
      duration,
      reason,
      agenda,
      location,
      created_by: req.user.id
    });

    const ptmWithDetails = await PTM.findByPk(ptm.id, {
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'ptm_parent', attributes: ['id', 'name', 'email'] },
        { model: Student, as: 'student', attributes: ['id', 'name', 'class', 'section'] }
      ]
    });

    res.status(201).json(ptmWithDetails);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getTeacherPTMs = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = { teacher_id: req.user.id };
    
    if (status) {
      whereClause.status = status;
    }

    const ptms = await PTM.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'ptm_parent', attributes: ['id', 'name', 'email'] },
        { model: Student, as: 'student', attributes: ['id', 'name', 'class', 'section'] }
      ],
      order: [['meeting_date', 'ASC'], ['meeting_time', 'ASC']]
    });

    res.json(ptms);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.updatePTMStatus = async (req, res) => {
  try {
    const { ptmId } = req.params;
    const { status, notes } = req.body;

    if (!['scheduled', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: scheduled, confirmed, completed, cancelled' 
      });
    }

    const ptm = await PTM.findOne({
      where: { id: ptmId, teacher_id: req.user.id }
    });

    if (!ptm) {
      return res.status(404).json({ message: 'PTM not found' });
    }

    await ptm.update({ status, notes });

    const updatedPTM = await PTM.findByPk(ptm.id, {
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'ptm_parent', attributes: ['id', 'name', 'email'] },
        { model: Student, as: 'student', attributes: ['id', 'name', 'class', 'section'] }
      ]
    });

    res.json(updatedPTM);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getStudentsForPTM = async (req, res) => {
  try {
    // Get all students with their parent information
    const students = await Student.findAll({
      include: [
        { model: User, as: 'parent', attributes: ['id', 'name', 'email'] }
      ],
      where: {
        parent_id: { [require('sequelize').Op.ne]: null }
      }
    });

    res.json(students);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// =================== STUDENT MANAGEMENT ===================

exports.getStudentsByClass = async (req, res) => {
  try {
    const { class: selectedClass, section } = req.query;
    
    // Build where condition based on provided parameters
    const whereCondition = {};
    if (selectedClass) {
      whereCondition.class = selectedClass;
    }
    if (section) {
      whereCondition.section = section;
    }
    
    const students = await Student.findAll({
      where: whereCondition,
      include: [
        { 
          model: User, 
          as: 'student_user', 
          attributes: ['id', 'name', 'email'],
          required: false 
        }
      ],
      attributes: ['id', 'name', 'class', 'section', 'user_id'],
      order: [['class', 'ASC'], ['section', 'ASC'], ['name', 'ASC']]
    });

    // Group students by class and section for easier frontend handling
    const groupedStudents = students.reduce((acc, student) => {
      const key = `${student.class}-${student.section}`;
      if (!acc[key]) {
        acc[key] = {
          class: student.class,
          section: student.section,
          students: []
        };
      }
      acc[key].students.push({
        id: student.id,
        name: student.name,
        user_id: student.user_id,
        user: student.student_user
      });
      return acc;
    }, {});

    res.json({
      students: students,
      grouped: Object.values(groupedStudents),
      classes: [...new Set(students.map(s => s.class))].sort(),
      sections: [...new Set(students.map(s => s.section))].sort()
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
