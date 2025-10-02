require('dotenv').config();
const { sequelize, Assignment, Class, Subject, User } = require('../models/postgres');

(async () => {
  try {
    await sequelize.sync();
    
    // Get or create a class 
    let classRecord = await Class.findOne({ where: { class_name: '10A' } });
    if (!classRecord) {
      classRecord = await Class.create({
        class_name: '10A',
        section: 'A',
        academic_year: '2024-25',
        class_teacher_id: 1
      });
      console.log('Created class:', classRecord.class_name);
    }
    
    // Get or create a subject
    let subject = await Subject.findOne({ where: { name: 'Mathematics' } });
    if (!subject) {
      subject = await Subject.create({
        name: 'Mathematics',
        code: 'MATH10',
        description: 'Mathematics for Class 10'
      });
      console.log('Created subject:', subject.name);
    }
    
    // Create a test assignment
    const assignment = await Assignment.create({
      title: 'Test Assignment - Math Problem Set',
      description: 'Solve the given mathematical problems and submit your solutions.',
      teacher_id: 1, // Admin user for testing
      class_id: classRecord.id,
      subject_id: subject.id,
      assignment_type: 'homework',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      submission_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'published', // Make it published so students can see it
      created_by: 1,
      max_marks: 100,
      instructions: 'Please submit your work with clear explanations. You may upload files or type your answers.',
      allow_late_submission: true
    });
    
    console.log('Created test assignment:', {
      id: assignment.id,
      title: assignment.title,
      class: classRecord.class_name,
      subject: subject.name,
      status: assignment.status
    });
    
    process.exit(0);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
})();
