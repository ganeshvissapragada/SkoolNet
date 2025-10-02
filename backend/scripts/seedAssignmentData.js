const { 
  User, 
  Student, 
  Class, 
  Subject, 
  Assignment, 
  AssignmentSubmission,
  sequelize 
} = require('../models/postgres');

async function seedAssignmentData() {
  try {
    console.log('Seeding Assignment data...');

    // Get teacher, classes, and subjects
    const teacher = await User.findOne({ where: { role: 'teacher' } });
    const classes = await Class.findAll();
    const subjects = await Subject.findAll();
    const students = await Student.findAll();

    if (!teacher || classes.length === 0 || subjects.length === 0) {
      console.log('❌ Missing required data. Please seed basic data first.');
      return;
    }

    // Sample assignments
    const assignments = [
      {
        title: 'Mathematics Chapter 5 - Algebra',
        description: 'Complete exercises 5.1 to 5.5 from the textbook. Show all working steps clearly.',
        teacher_id: teacher.id,
        class_id: classes[0].id,
        subject_id: subjects[0].id,
        assignment_type: 'homework',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        submission_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        is_graded: true,
        max_marks: 50,
        instructions: 'Please write neatly and show all calculations. Upload a clear photo or PDF of your work.',
        status: 'published',
        created_by: teacher.id,
        attachments: [
          {
            type: 'pdf',
            name: 'Chapter 5 Reference.pdf',
            url: '/uploads/assignments/chapter5_ref.pdf'
          }
        ]
      },
      {
        title: 'Science Project - Solar System Model',
        description: 'Create a 3D model of the solar system using readily available materials. Include all planets with proper relative sizes.',
        teacher_id: teacher.id,
        class_id: classes[0].id,
        subject_id: subjects[1] ? subjects[1].id : subjects[0].id,
        assignment_type: 'project',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        submission_deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        is_graded: true,
        max_marks: 100,
        instructions: 'Submit photos of your model from different angles. Include a brief explanation of each planet.',
        status: 'published',
        created_by: teacher.id,
        attachments: [
          {
            type: 'link',
            name: 'Solar System Reference',
            url: 'https://solarsystem.nasa.gov/'
          }
        ]
      },
      {
        title: 'English Essay - My Dreams',
        description: 'Write a 500-word essay about your dreams and aspirations. Focus on grammar, vocabulary, and creative expression.',
        teacher_id: teacher.id,
        class_id: classes[0].id,
        subject_id: subjects[2] ? subjects[2].id : subjects[0].id,
        assignment_type: 'homework',
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        submission_deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        is_graded: true,
        max_marks: 25,
        instructions: 'Type your essay or write neatly by hand. Check spelling and grammar before submission.',
        status: 'published',
        created_by: teacher.id,
        allow_late_submission: true
      },
      {
        title: 'Group Activity - Historical Timeline',
        description: 'Work in groups of 4 to create a timeline of important events in Indian history from 1857 to 1947.',
        teacher_id: teacher.id,
        class_id: classes[0].id,
        subject_id: subjects[3] ? subjects[3].id : subjects[0].id,
        assignment_type: 'group_work',
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        submission_deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        is_graded: true,
        max_marks: 75,
        instructions: 'Each group member should research different periods. Combine your research into a comprehensive timeline.',
        status: 'published',
        created_by: teacher.id
      },
      {
        title: 'Practice Problems - Geometry',
        description: 'Solve the practice problems to prepare for next week\'s test. This is for practice only.',
        teacher_id: teacher.id,
        class_id: classes[0].id,
        subject_id: subjects[0].id,
        assignment_type: 'practice',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        submission_deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        is_graded: false,
        max_marks: 0,
        instructions: 'These problems are for your practice. Solutions will be discussed in class.',
        status: 'published',
        created_by: teacher.id
      }
    ];

    // Create assignments
    const createdAssignments = await Assignment.bulkCreate(assignments);
    console.log(`✅ Created ${createdAssignments.length} assignments`);

    // Create some sample submissions for the first assignment
    if (students.length > 0 && createdAssignments.length > 0) {
      const assignment = createdAssignments[0];
      const studentUser = await User.findOne({ where: { role: 'student' } });
      
      if (studentUser) {
        const submission = await AssignmentSubmission.create({
          assignment_id: assignment.id,
          student_id: students[0].id,
          submitted_by: studentUser.id,
          submission_text: 'I have completed all exercises from 5.1 to 5.5. The solutions are attached as images.',
          attachments: [
            {
              type: 'image',
              name: 'exercise_5_1_to_5_3.jpg',
              url: '/uploads/submissions/math_homework_1.jpg'
            },
            {
              type: 'image', 
              name: 'exercise_5_4_to_5_5.jpg',
              url: '/uploads/submissions/math_homework_2.jpg'
            }
          ],
          submission_date: new Date(),
          is_late: false,
          status: 'submitted'
        });

        console.log('✅ Created sample assignment submission');
      }
    }

    console.log('🎉 Assignment data seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding assignment data:', error);
    process.exit(1);
  }
}

seedAssignmentData();
