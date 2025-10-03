const Attendance = require('../models/mongo/attendance');
const Marks = require('../models/mongo/marks');
const { PTM, User, Student, Assignment, AssignmentSubmission, Class, Subject, TeacherAssignment } = require('../models/postgres');

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
        },
        { 
          model: User, 
          as: 'parent', 
          attributes: ['id', 'name', 'email'],
          required: false 
        }
      ],
      attributes: ['id', 'name', 'class', 'section', 'user_id', 'parent_id'],
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
        parent_id: student.parent_id,
        user: student.student_user,
        parent: student.parent
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

// Assignment Management

// Create a new assignment
exports.createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      class_id,
      subject_id,
      assignment_type = 'homework',
      attachments = [],
      due_date,
      submission_deadline,
      is_graded = true,
      allow_late_submission = false,
      max_marks = 100,
      instructions,
      status = 'draft'
    } = req.body;

    if (!title || !description || !class_id || !subject_id || !due_date) {
      return res.status(400).json({ 
        message: 'Title, description, class_id, subject_id, and due_date are required' 
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      teacher_id: req.user.id,
      class_id,
      subject_id,
      assignment_type,
      attachments,
      due_date,
      submission_deadline: submission_deadline || due_date,
      is_graded,
      allow_late_submission,
      max_marks,
      instructions,
      status,
      created_by: req.user.id
    });

    const assignmentWithDetails = await Assignment.findByPk(assignment.id, {
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' },
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment: assignmentWithDetails
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all assignments for a teacher
exports.getMyAssignments = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { academic_year } = req.query;
    
    const whereClause = { 
      teacher_id: teacherId,
      is_active: true
    };
    
    if (academic_year) {
      whereClause.academic_year = academic_year;
    }

    const assignments = await TeacherAssignment.findAll({
      where: whereClause,
      include: [
        { 
          model: Class, 
          as: 'class', 
          attributes: ['id', 'class_name', 'section'],
          include: [
            { 
              model: Subject, 
              as: 'Subjects',
              attributes: ['id', 'name']
            }
          ]
        },
        { model: Subject, as: 'subject', attributes: ['id', 'name'] }
      ],
      order: [
        [{ model: Class, as: 'class' }, 'class_name', 'ASC'],
        [{ model: Subject, as: 'subject' }, 'name', 'ASC']
      ]
    });

    // Group by class to make it easier for frontend
    const groupedAssignments = {};
    assignments.forEach(assignment => {
      const classKey = `${assignment.class.class_name}-${assignment.class.section}`;
      if (!groupedAssignments[classKey]) {
        groupedAssignments[classKey] = {
          class: assignment.class,
          subjects: []
        };
      }
      groupedAssignments[classKey].subjects.push(assignment.subject);
    });

    res.json({
      assignments,
      groupedAssignments: Object.values(groupedAssignments)
    });
  } catch (error) {
    console.error('Get teacher assignments error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get assignment by ID with all submissions
exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findOne({
      where: { id, teacher_id: req.user.id },
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' },
        { 
          model: AssignmentSubmission, 
          as: 'submissions',
          include: [
            { model: Student, as: 'student' },
            { model: User, as: 'submitted_by_user', attributes: ['id', 'name'] }
          ]
        }
      ]
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ assignment });
  } catch (error) {
    console.error('Get assignment by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const assignment = await Assignment.findOne({
      where: { id, teacher_id: req.user.id }
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await assignment.update(updateData);

    const updatedAssignment = await Assignment.findByPk(id, {
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' }
      ]
    });

    res.json({
      message: 'Assignment updated successfully',
      assignment: updatedAssignment
    });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Grade a submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks_obtained, grade, feedback, status = 'graded' } = req.body;

    const submission = await AssignmentSubmission.findOne({
      where: { id: submissionId },
      include: [
        { 
          model: Assignment, 
          as: 'assignment',
          where: { teacher_id: req.user.id }
        }
      ]
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    await submission.update({
      marks_obtained,
      grade,
      feedback,
      status,
      graded_by: req.user.id,
      graded_at: new Date()
    });

    const updatedSubmission = await AssignmentSubmission.findByPk(submissionId, {
      include: [
        { model: Assignment, as: 'assignment' },
        { model: Student, as: 'student' },
        { model: User, as: 'submitted_by_user', attributes: ['id', 'name'] }
      ]
    });

    res.json({
      message: 'Submission graded successfully',
      submission: updatedSubmission
    });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Request resubmission
exports.requestResubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { resubmission_reason } = req.body;

    const submission = await AssignmentSubmission.findOne({
      where: { id: submissionId },
      include: [
        { 
          model: Assignment, 
          as: 'assignment',
          where: { teacher_id: req.user.id }
        }
      ]
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    await submission.update({
      status: 'returned',
      resubmission_requested: true,
      resubmission_reason,
      graded_by: req.user.id,
      graded_at: new Date()
    });

    res.json({
      message: 'Resubmission requested successfully'
    });
  } catch (error) {
    console.error('Request resubmission error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get classes and subjects for assignment creation
exports.getClassesAndSubjects = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        { model: Subject, as: 'Subjects' }
      ]
    });

    res.json({ classes });
  } catch (error) {
    console.error('Get classes and subjects error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get teacher's assigned classes and subjects
exports.getMyAssignments = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { academic_year } = req.query;
    
    const whereClause = { 
      teacher_id: teacherId,
      is_active: true
    };
    
    if (academic_year) {
      whereClause.academic_year = academic_year;
    }

    const assignments = await TeacherAssignment.findAll({
      where: whereClause,
      include: [
        { 
          model: Class, 
          as: 'class', 
          attributes: ['id', 'class_name', 'section'],
          include: [
            { 
              model: Subject, 
              as: 'Subjects',
              attributes: ['id', 'name']
            }
          ]
        },
        { model: Subject, as: 'subject', attributes: ['id', 'name'] }
      ],
      order: [
        [{ model: Class, as: 'class' }, 'class_name', 'ASC'],
        [{ model: Subject, as: 'subject' }, 'name', 'ASC']
      ]
    });

    // Group by class to make it easier for frontend
    const groupedAssignments = {};
    assignments.forEach(assignment => {
      const classKey = `${assignment.class.class_name}-${assignment.class.section}`;
      if (!groupedAssignments[classKey]) {
        groupedAssignments[classKey] = {
          class: assignment.class,
          subjects: []
        };
      }
      groupedAssignments[classKey].subjects.push(assignment.subject);
    });

    res.json({
      assignments,
      groupedAssignments: Object.values(groupedAssignments)
    });
  } catch (error) {
    console.error('Get teacher assignments error:', error);
    res.status(500).json({ message: error.message });
  }
};
