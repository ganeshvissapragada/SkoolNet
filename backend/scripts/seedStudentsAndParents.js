require('dotenv').config();
const { sequelize, User, Student } = require('../models/postgres');
const bcrypt = require('bcryptjs');

const sampleUsers = [
  // Parents
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@parent.com',
    password: 'parent123',
    role: 'parent'
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@parent.com',
    password: 'parent123',
    role: 'parent'
  },
  {
    name: 'Sunita Patel',
    email: 'sunita.patel@parent.com',
    password: 'parent123',
    role: 'parent'
  },
  {
    name: 'Amit Singh',
    email: 'amit.singh@parent.com',
    password: 'parent123',
    role: 'parent'
  },
  {
    name: 'Kavya Reddy',
    email: 'kavya.reddy@parent.com',
    password: 'parent123',
    role: 'parent'
  },
  // Students
  {
    name: 'Arjun Sharma',
    email: 'arjun.sharma@student.com',
    password: 'student123',
    role: 'student'
  },
  {
    name: 'Diya Kumar',
    email: 'diya.kumar@student.com',
    password: 'student123',
    role: 'student'
  },
  {
    name: 'Rohan Patel',
    email: 'rohan.patel@student.com',
    password: 'student123',
    role: 'student'
  },
  {
    name: 'Aadhya Singh',
    email: 'aadhya.singh@student.com',
    password: 'student123',
    role: 'student'
  },
  {
    name: 'Karthik Reddy',
    email: 'karthik.reddy@student.com',
    password: 'student123',
    role: 'student'
  },
  {
    name: 'Ananya Gupta',
    email: 'ananya.gupta@student.com',
    password: 'student123',
    role: 'student'
  }
];

const sampleStudents = [
  {
    name: 'Arjun Sharma',
    class: '5th Grade',
    section: 'A',
    parent_id: null // Will be set after creating users
  },
  {
    name: 'Diya Kumar',
    class: '4th Grade',
    section: 'B',
    parent_id: null
  },
  {
    name: 'Rohan Patel',
    class: '6th Grade',
    section: 'A',
    parent_id: null
  },
  {
    name: 'Aadhya Singh',
    class: '5th Grade',
    section: 'C',
    parent_id: null
  },
  {
    name: 'Karthik Reddy',
    class: '7th Grade',
    section: 'B',
    parent_id: null
  },
  {
    name: 'Ananya Gupta',
    class: '4th Grade',
    section: 'A',
    parent_id: null
  }
];

const seedStudentsAndParents = async () => {
  try {
    console.log('👥 Starting Students & Parents Seeding...');
    
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');
    
    // Clear existing data (skip if foreign key constraints exist)
    try {
      await Student.destroy({ where: {} });
      await User.destroy({ where: { role: ['parent', 'student'] } });
      console.log('🧹 Cleared existing students and parents');
    } catch (err) {
      console.log('⚠️ Skipping cleanup due to foreign key constraints, adding new data...');
    }
    
    const createdUsers = [];
    const createdParents = [];
    const createdStudents = [];
    
    // Create users
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      createdUsers.push(user);
      
      if (user.role === 'parent') {
        createdParents.push(user);
      }
      
      console.log(`✅ Created ${user.role}: ${user.name} (${user.email})`);
    }
    
    // Create student records with parent associations
    for (let i = 0; i < sampleStudents.length; i++) {
      const studentData = sampleStudents[i];
      // Assign parent (cycling through available parents)
      const parentIndex = i % createdParents.length;
      const parent = createdParents[parentIndex];
      
      const student = await Student.create({
        ...studentData,
        parent_id: parent.id
      });
      createdStudents.push(student);
      
      console.log(`✅ Created student: ${student.name} (Class: ${student.class} ${student.section}, Parent: ${parent.name})`);
    }
    
    console.log('\n🎉 Students & Parents Seeded Successfully!');
    
    // Summary
    console.log(`\n📊 Summary:`);
    console.log(`👨‍👩‍👧‍👦 Total Parents: ${createdParents.length}`);
    console.log(`👧👦 Total Students: ${createdStudents.length}`);
    console.log(`📚 Classes: 4th Grade, 5th Grade, 6th Grade, 7th Grade`);
    console.log(`📝 Sections: A, B, C`);
    
    console.log(`\n🔐 Login Credentials:`);
    console.log(`📧 Parent Login: priya.sharma@parent.com / parent123`);
    console.log(`📧 Student Login: arjun.sharma@student.com / student123`);
    console.log(`📧 Admin Login: admin@example.com / admin`);
    
    console.log(`\n👪 Parent-Student Associations:`);
    for (let i = 0; i < createdStudents.length; i++) {
      const student = createdStudents[i];
      const parent = createdParents[i % createdParents.length];
      console.log(`   ${parent.name} → ${student.name} (${student.class} ${student.section})`);
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding students and parents:', error);
    process.exit(1);
  }
};

seedStudentsAndParents();
