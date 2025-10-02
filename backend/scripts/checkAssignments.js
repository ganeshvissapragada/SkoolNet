require('dotenv').config();
const { Assignment, Class, Subject, User } = require('../models/postgres');

async function checkAssignments() {
  try {
    console.log('🔍 Checking all assignments in database...');
    
    const assignments = await Assignment.findAll({
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' },
        { model: User, as: 'teacher', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`\n📊 Found ${assignments.length} assignments:\n`);
    
    assignments.forEach((assignment, index) => {
      console.log(`${index + 1}. ${assignment.title}`);
      console.log(`   📚 Class: ${assignment.class.class_name}-${assignment.class.section}`);
      console.log(`   📖 Subject: ${assignment.subject.name}`);
      console.log(`   👨‍🏫 Teacher: ${assignment.teacher.name}`);
      console.log(`   📋 Status: ${assignment.status}`);
      console.log(`   📅 Due: ${assignment.due_date}`);
      console.log('   ');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAssignments();
