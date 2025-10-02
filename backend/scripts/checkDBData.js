const { Class, Subject } = require('../models/postgres');

async function checkDBData() {
  try {
    console.log('🔍 Checking database for Classes and Subjects...');
    
    const classes = await Class.findAll({
      include: [
        { model: Subject, as: 'Subjects' }
      ]
    });
    
    console.log('📊 Found', classes.length, 'classes in database:');
    classes.forEach((cls, index) => {
      console.log(`  ${index + 1}. Class: ${cls.class_name} - ${cls.section}`);
      console.log(`     Subjects: ${cls.Subjects?.length || 0}`);
      cls.Subjects?.forEach((subject, subIndex) => {
        console.log(`       ${subIndex + 1}. ${subject.name}`);
      });
    });
    
    if (classes.length === 0) {
      console.log('⚠️  No classes found in database. You may need to seed data.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
}

checkDBData();
