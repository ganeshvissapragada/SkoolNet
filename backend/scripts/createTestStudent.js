require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Student } = require('../models/postgres');

(async () => {
  try {
    await sequelize.sync();
    
    // Create a test student user
    const email = 'test.student@school.edu';
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      console.log('Test student user already exists:', email);
      console.log('User ID:', existingUser.id);
      
      // Check if student record exists
      const student = await Student.findOne({ where: { user_id: existingUser.id } });
      if (student) {
        console.log('Student record found:', student.name, student.class);
      } else {
        console.log('Creating student record...');
        const newStudent = await Student.create({
          user_id: existingUser.id,
          student_id: 'STU001',
          name: existingUser.name,
          class: '10A',
          section: 'A',
          roll_number: 1,
          date_of_birth: '2008-01-01',
          gender: 'Male',
          address: '123 Test Street',
          phone: '1234567890',
          parent_contact: '9876543210'
        });
        console.log('Student record created:', newStudent.name);
      }
      process.exit(0);
    }
    
    const password = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Test Student',
      email,
      password,
      role: 'student'
    });
    
    // Create student record
    const student = await Student.create({
      user_id: user.id,
      student_id: 'STU001',
      name: user.name,
      class: '10A',
      section: 'A',
      roll_number: 1,
      date_of_birth: '2008-01-01',
      gender: 'Male',
      address: '123 Test Street',
      phone: '1234567890',
      parent_contact: '9876543210'
    });
    
    console.log('Created test student:', { 
      userId: user.id, 
      email: user.email, 
      studentId: student.id,
      name: student.name,
      class: student.class 
    });
    process.exit(0);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
})();
