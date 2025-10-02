require('dotenv').config();
const { sequelize, Class, Subject } = require('../models/postgres');

async function seedClassesAndSubjects() {
  try {
    console.log('🏫 Seeding Classes and Subjects...');
    
    // First create classes
    const classesData = [
      { class_name: '6', section: 'A' },
      { class_name: '6', section: 'B' },
      { class_name: '7', section: 'A' },
      { class_name: '7', section: 'B' },
      { class_name: '8', section: 'A' },
      { class_name: '8', section: 'B' },
      { class_name: '9', section: 'A' },
      { class_name: '9', section: 'B' },
      { class_name: '10', section: 'A' },
      { class_name: '10', section: 'B' }
    ];
    
    console.log('📚 Creating classes...');
    const createdClasses = [];
    for (const classData of classesData) {
      const [cls, created] = await Class.findOrCreate({
        where: { class_name: classData.class_name, section: classData.section },
        defaults: classData
      });
      createdClasses.push(cls);
      if (created) {
        console.log(`✅ Created class: ${cls.class_name}-${cls.section}`);
      } else {
        console.log(`👍 Class already exists: ${cls.class_name}-${cls.section}`);
      }
    }
    
    // Now create subjects for each class
    const subjectsData = [
      'Mathematics',
      'Science', 
      'English',
      'Social Studies',
      'Hindi',
      'Physical Education',
      'Art',
      'Music'
    ];
    
    console.log('📖 Creating subjects for each class...');
    for (const cls of createdClasses) {
      for (const subjectName of subjectsData) {
        const [subject, created] = await Subject.findOrCreate({
          where: { name: subjectName, class_id: cls.id },
          defaults: { name: subjectName, class_id: cls.id }
        });
        
        if (created) {
          console.log(`✅ Created subject: ${subjectName} for class ${cls.class_name}-${cls.section}`);
        }
      }
    }
    
    // Verify the data
    const totalClasses = await Class.count();
    const totalSubjects = await Subject.count();
    
    console.log(`🎉 Seeding complete!`);
    console.log(`📊 Total classes: ${totalClasses}`);
    console.log(`📊 Total subjects: ${totalSubjects}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding classes and subjects:', error);
    process.exit(1);
  }
}

seedClassesAndSubjects();
