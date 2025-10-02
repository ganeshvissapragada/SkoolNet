require('dotenv').config();
const { Student, User } = require('../models/postgres');

async function checkStudentData() {
  try {
    console.log('🔍 Checking student data...');
    
    const students = await Student.findAll({
      include: [{
        model: User,
        as: 'student_user',
        attributes: ['id', 'name', 'email']
      }],
      where: {
        class: '8'
      }
    });
    
    console.log(`\n📊 Found ${students.length} students in class 8:\n`);
    
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name}`);
      console.log(`   👤 User: ${student.student_user?.name} (${student.student_user?.email})`);
      console.log(`   🎓 Class: ${student.class}`);
      console.log(`   📍 Section: ${student.section || 'No section'}`);
      console.log(`   🆔 Student ID: ${student.id}, User ID: ${student.user_id}`);
      console.log('   ');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkStudentData();
