require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User, Student, sequelize } = require('../models/postgres');
const connectMongo = require('../config/mongo');

async function seedPTMData() {
  try {
    await connectMongo();
    await sequelize.sync();

    console.log('Seeding PTM test data...');

    // Create teacher users
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const [teacher1] = await User.findOrCreate({
      where: { email: 'teacher1@school.com' },
      defaults: {
        name: 'John Smith',
        email: 'teacher1@school.com',
        password: teacherPassword,
        role: 'teacher'
      }
    });

    const [teacher2] = await User.findOrCreate({
      where: { email: 'teacher2@school.com' },
      defaults: {
        name: 'Jane Doe',
        email: 'teacher2@school.com',
        password: teacherPassword,
        role: 'teacher'
      }
    });

    // Create parent users
    const parentPassword = await bcrypt.hash('parent123', 10);
    const [parent1] = await User.findOrCreate({
      where: { email: 'parent1@example.com' },
      defaults: {
        name: 'Michael Johnson',
        email: 'parent1@example.com',
        password: parentPassword,
        role: 'parent'
      }
    });

    const [parent2] = await User.findOrCreate({
      where: { email: 'parent2@example.com' },
      defaults: {
        name: 'Sarah Wilson',
        email: 'parent2@example.com',
        password: parentPassword,
        role: 'parent'
      }
    });

    const [parent3] = await User.findOrCreate({
      where: { email: 'parent3@example.com' },
      defaults: {
        name: 'David Brown',
        email: 'parent3@example.com',
        password: parentPassword,
        role: 'parent'
      }
    });

    // Create student users and link them to parents
    const studentPassword = await bcrypt.hash('student123', 10);
    
    const [student1] = await User.findOrCreate({
      where: { email: 'alice@student.com' },
      defaults: {
        name: 'Alice Johnson',
        email: 'alice@student.com',
        password: studentPassword,
        role: 'student'
      }
    });

    const [student2] = await User.findOrCreate({
      where: { email: 'bob@student.com' },
      defaults: {
        name: 'Bob Wilson',
        email: 'bob@student.com',
        password: studentPassword,
        role: 'student'
      }
    });

    const [student3] = await User.findOrCreate({
      where: { email: 'charlie@student.com' },
      defaults: {
        name: 'Charlie Brown',
        email: 'charlie@student.com',
        password: studentPassword,
        role: 'student'
      }
    });

    // Create student records linked to parents
    await Student.findOrCreate({
      where: { name: 'Alice Johnson' },
      defaults: {
        name: 'Alice Johnson',
        class: '10',
        section: 'A',
        parent_id: parent1.id
      }
    });

    await Student.findOrCreate({
      where: { name: 'Bob Wilson' },
      defaults: {
        name: 'Bob Wilson',
        class: '9',
        section: 'B',
        parent_id: parent2.id
      }
    });

    await Student.findOrCreate({
      where: { name: 'Charlie Brown' },
      defaults: {
        name: 'Charlie Brown',
        class: '11',
        section: 'A',
        parent_id: parent3.id
      }
    });

    console.log('PTM test data seeded successfully!');
    console.log('\nTest Accounts Created:');
    console.log('Teachers:');
    console.log('- teacher1@school.com / teacher123 (John Smith)');
    console.log('- teacher2@school.com / teacher123 (Jane Doe)');
    console.log('\nParents:');
    console.log('- parent1@example.com / parent123 (Michael Johnson - Alice\'s parent)');
    console.log('- parent2@example.com / parent123 (Sarah Wilson - Bob\'s parent)');
    console.log('- parent3@example.com / parent123 (David Brown - Charlie\'s parent)');
    console.log('\nStudents:');
    console.log('- Alice Johnson (Class 10A)');
    console.log('- Bob Wilson (Class 9B)');
    console.log('- Charlie Brown (Class 11A)');

  } catch (error) {
    console.error('Error seeding PTM data:', error);
  } finally {
    process.exit(0);
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedPTMData();
}

module.exports = { seedPTMData };
