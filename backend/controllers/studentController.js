const Attendance = require('../models/mongo/attendance');
const Marks = require('../models/mongo/marks');
const MealFeedback = require('../models/mongo/mealFeedback');
const { Scholarship, User, Student, MealPlan, MealConsumption, Assignment, AssignmentSubmission, Class, Subject, sequelize } = require('../models/postgres');
const { Op } = require('sequelize');

// Helper function to get student record from user ID
const getStudentFromUserId = async (userId) => {
  console.log('🔍 Looking for student with user_id:', userId);
  
  // Now we have proper user_id linking, so this should work directly
  const student = await Student.findOne({
    where: { user_id: userId },
    include: [{
      model: User,
      as: 'student_user',
      attributes: ['id', 'name', 'email']
    }]
  });

  console.log('📍 Student found:', student ? {
    id: student.id,
    name: student.name,
    class: student.class,
    user_id: student.user_id
  } : 'null');

  return student;
};

exports.getAttendance = async (req, res) => {
  try {
    const userId = Number(req.params.studentId); // This is actually user ID from frontend
    if (!userId) return res.status(400).json({ message: 'userId required' });
    
    // Get student record using user ID
    const student = await getStudentFromUserId(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }
    
    // Now use the student's postgres ID for MongoDB query
    const items = await Attendance.find({ studentId: student.id }).sort({ date: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getMarks = async (req, res) => {
  try {
    const userId = Number(req.params.studentId); // This is actually user ID from frontend
    if (!userId) return res.status(400).json({ message: 'userId required' });
    
    // Get student record using user ID
    const student = await getStudentFromUserId(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }
    
    // Now use the student's postgres ID for MongoDB query
    const items = await Marks.find({ studentId: student.id }).sort({ date: -1 });
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
      where: { user_id: studentUserId },
      include: [
        {
          model: User,
          as: 'student_user',
          attributes: ['id', 'name', 'email']
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
// =================== MEAL SYSTEM - STUDENT VIEW ===================

exports.getDailyMealPlan = async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date || new Date().toISOString().split('T')[0];
    
    const mealPlans = await MealPlan.findAll({
      where: { date: queryDate },
      attributes: ['id', 'date', 'meal_name', 'description', 'items', 'nutritional_info', 'allergens', 'meal_type', 'status', 'special_notes']
    });

    res.json(mealPlans);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getMyMealConsumption = async (req, res) => {
  try {
    const userId = parseInt(req.params.studentId); // This is actually the user ID from frontend
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }
    
    // Get student record using the helper function that looks up by user_id
    const student = await getStudentFromUserId(userId);

    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    const { date, week } = req.query;
    let mealPlanWhere = {};
    
    if (date) {
      mealPlanWhere.date = date;
    } else if (week) {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      mealPlanWhere.date = {
        [Op.between]: [startOfWeek.toISOString().split('T')[0], endOfWeek.toISOString().split('T')[0]]
      };
    } else {
      // Default to current week
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      mealPlanWhere.date = {
        [Op.between]: [startOfWeek.toISOString().split('T')[0], endOfWeek.toISOString().split('T')[0]]
      };
    }

    const consumptions = await MealConsumption.findAll({
      where: { student_id: student.id },
      include: [
        {
          model: MealPlan,
          as: 'meal_plan',
          where: mealPlanWhere,
          attributes: ['id', 'date', 'meal_name', 'meal_type', 'items', 'nutritional_info']
        }
      ],
      order: [['consumed_at', 'DESC']]
    });

    res.json({ student, consumptions });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.submitMealFeedback = async (req, res) => {
  try {
    const userId = parseInt(req.params.studentId); // This is actually the user ID from frontend
    const { mealPlanId, rating, feedback, aspects, isAnonymous } = req.body;

    if (!userId || !mealPlanId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Valid user ID, meal plan ID and rating (1-5) are required'
      });
    }

    // Get student record using the helper function that looks up by user_id
    const student = await getStudentFromUserId(userId);

    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    const MealFeedback = require('../models/mongo/mealFeedback');
    
    // Check if feedback already exists
    const existingFeedback = await MealFeedback.findOne({
      mealPlanId: parseInt(mealPlanId),
      studentId: student.id,
      feedbackType: 'student'
    });

    if (existingFeedback) {
      // Update existing feedback
      existingFeedback.rating = rating;
      existingFeedback.feedback = feedback || '';
      existingFeedback.aspects = aspects || {};
      existingFeedback.isAnonymous = isAnonymous || false;
      await existingFeedback.save();
      
      res.json({ message: 'Feedback updated successfully', feedback: existingFeedback });
    } else {
      // Create new feedback
      const newFeedback = new MealFeedback({
        mealPlanId: parseInt(mealPlanId),
        studentId: student.id,
        rating,
        feedback: feedback || '',
        aspects: aspects || {},
        feedbackType: 'student',
        isAnonymous: isAnonymous || false
      });

      await newFeedback.save();
      res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Assignment Management

// Get assignments for student
exports.getAssignments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get student record using user ID
    const student = await getStudentFromUserId(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    console.log(`🔍 Looking for assignments for student: ${student.name}, class: ${student.class}, section: ${student.section}`);

    // Get assignments for student's class and section
    const assignments = await Assignment.findAll({
      where: { 
        status: 'published',
        '$class.class_name$': student.class,
        ...(student.section && { '$class.section$': student.section })
      },
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' },
        { model: User, as: 'teacher', attributes: ['id', 'name'] },
        { 
          model: AssignmentSubmission, 
          as: 'submissions',
          where: { student_id: student.id },
          required: false,
          include: [
            { model: User, as: 'submitted_by_user', attributes: ['id', 'name'] }
          ]
        }
      ],
      order: [['due_date', 'ASC']]
    });

    console.log(`📚 Found ${assignments.length} assignments for student`);
    assignments.forEach(assignment => {
      console.log(`- ${assignment.title} (${assignment.class.class_name}-${assignment.class.section}, ${assignment.subject.name})`);
    });

    // Add submission status to each assignment
    const assignmentsWithStatus = assignments.map(assignment => {
      const submission = assignment.submissions && assignment.submissions.length > 0 
        ? assignment.submissions[0] 
        : null;
      
      return {
        ...assignment.toJSON(),
        submission_status: submission ? submission.status : 'pending',
        submitted_at: submission ? submission.submission_date : null,
        is_late: submission ? submission.is_late : false,
        marks_obtained: submission ? submission.marks_obtained : null,
        feedback: submission ? submission.feedback : null
      };
    });

    res.json({ assignments: assignmentsWithStatus });
  } catch (error) {
    console.error('Get student assignments error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Submit assignment
exports.submitAssignment = async (req, res) => {
  try {
    console.log('📝 Assignment submission started');
    console.log('🔍 Headers:', req.headers);
    console.log('📋 Request params:', req.params);
    console.log('📝 Request body:', req.body);
    console.log('📎 Request files:', req.files);
    console.log('👤 User:', req.user);
    console.log('🛠️ Content-Type:', req.get('content-type'));

    const { assignmentId } = req.params;
    const { submission_text } = req.body;
    const userId = req.user.id;

    // Handle uploaded files - for now, let's just handle the JSON data from the body
    let attachments = [];
    
    // If files are sent as FormData, they'll be in req.files
    if (req.files && req.files.length > 0) {
      console.log('✅ Processing files from req.files');
      attachments = req.files.map(file => ({
        name: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: file.path,
        url: `/uploads/assignments/${file.filename}`
      }));
    } 
    // If attachments are sent as JSON in the body (from our current frontend)
    else if (req.body.attachments) {
      console.log('✅ Processing attachments from req.body');
      // For now, we'll just store the file names - we'll implement actual file upload later
      attachments = Array.isArray(req.body.attachments) ? req.body.attachments : [];
    }

    console.log('📎 Processed attachments:', attachments);

    // Get student record using user ID
    const student = await getStudentFromUserId(userId);
    if (!student) {
      console.log('❌ Student record not found for user ID:', userId);
      return res.status(404).json({ message: 'Student record not found' });
    }
    console.log('👨‍🎓 Found student:', student.name, student.class);

    // Get assignment and check if it exists and is published
    const assignment = await Assignment.findOne({
      where: { 
        id: assignmentId, 
        status: 'published' 
      }
    });

    if (!assignment) {
      console.log('❌ Assignment not found or not published:', assignmentId);
      return res.status(404).json({ message: 'Assignment not found' });
    }
    console.log('📚 Found assignment:', assignment.title);

    // Check if student is in the correct class for this assignment
    const assignmentClass = await Class.findByPk(assignment.class_id);
    if (!assignmentClass || assignmentClass.class_name !== student.class) {
      console.log('❌ Class mismatch. Assignment class:', assignmentClass?.class_name, 'Student class:', student.class);
      return res.status(403).json({ message: 'Assignment not assigned to your class' });
    }

    // Check if already submitted
    const existingSubmission = await AssignmentSubmission.findOne({
      where: {
        assignment_id: assignmentId,
        student_id: student.id
      }
    });

    if (existingSubmission && !existingSubmission.resubmission_requested) {
      console.log('❌ Assignment already submitted');
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    // Check if deadline has passed
    const now = new Date();
    const isLate = now > new Date(assignment.submission_deadline);
    
    if (isLate && !assignment.allow_late_submission) {
      return res.status(400).json({ message: 'Submission deadline has passed' });
    }

    if (!submission_text && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ message: 'Either submission text or attachments are required' });
    }

    let submission;
    if (existingSubmission && existingSubmission.resubmission_requested) {
      // Update existing submission for resubmission
      await existingSubmission.update({
        submission_text,
        attachments,
        submission_date: now,
        is_late: isLate,
        status: 'resubmitted',
        resubmission_requested: false,
        marks_obtained: null,
        grade: null,
        feedback: null,
        graded_by: null,
        graded_at: null
      });
      submission = existingSubmission;
    } else {
      // Create new submission
      submission = await AssignmentSubmission.create({
        assignment_id: assignmentId,
        student_id: student.id,
        submitted_by: userId,
        submission_text,
        attachments,
        submission_date: now,
        is_late: isLate,
        status: 'submitted'
      });
    }

    const submissionWithDetails = await AssignmentSubmission.findByPk(submission.id, {
      include: [
        { model: Assignment, as: 'assignment' },
        { model: Student, as: 'student' },
        { model: User, as: 'submitted_by_user', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json({
      message: 'Assignment submitted successfully',
      submission: submissionWithDetails
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get specific assignment details
exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get student record using user ID
    const student = await getStudentFromUserId(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    const assignment = await Assignment.findOne({
      where: { 
        id, 
        status: 'published'
      },
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' },
        { model: User, as: 'teacher', attributes: ['id', 'name'] },
        { 
          model: AssignmentSubmission, 
          as: 'submissions',
          where: { student_id: student.id },
          required: false,
          include: [
            { model: User, as: 'submitted_by_user', attributes: ['id', 'name'] }
          ]
        }
      ]
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if student is in the correct class for this assignment
    if (assignment.class.class_name !== student.class) {
      return res.status(403).json({ message: 'Assignment not assigned to your class' });
    }

    const submission = assignment.submissions && assignment.submissions.length > 0 
      ? assignment.submissions[0] 
      : null;

    res.json({ 
      assignment: {
        ...assignment.toJSON(),
        submission_status: submission ? submission.status : 'pending',
        submitted_at: submission ? submission.submission_date : null,
        is_late: submission ? submission.is_late : false,
        marks_obtained: submission ? submission.marks_obtained : null,
        feedback: submission ? submission.feedback : null,
        submission
      }
    });
  } catch (error) {
    console.error('Get assignment by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};
