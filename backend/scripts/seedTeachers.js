require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User, sequelize } = require('../models/postgres');

async function seedTeachers() {
  try {
    await sequelize.sync();
    
    console.log('Seeding teacher users...');
    
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    
    // Create teacher1
    const [teacher1, created1] = await User.findOrCreate({
      where: { email: 'teacher1@school.com' },
      defaults: {
        name: 'John Smith',
        email: 'teacher1@school.com',
        password: teacherPassword,
        role: 'teacher'
      }
    });
    
    // Create teacher2
    const [teacher2, created2] = await User.findOrCreate({
      where: { email: 'teacher2@school.com' },
      defaults: {
        name: 'Jane Doe',
        email: 'teacher2@school.com',
        password: teacherPassword,
        role: 'teacher'
      }
    });
    
    console.log(`✅ Teacher 1: ${teacher1.email} ${created1 ? '(created)' : '(exists)'}`);
    console.log(`✅ Teacher 2: ${teacher2.email} ${created2 ? '(created)' : '(exists)'}`);
    
    console.log('\n📧 Teacher Login Credentials:');
    console.log('- teacher1@school.com / teacher123');
    console.log('- teacher2@school.com / teacher123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding teachers:', error);
    process.exit(1);
  }
}

seedTeachers();
