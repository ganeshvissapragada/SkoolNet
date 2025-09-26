const { Sequelize } = require('sequelize');

// Connect directly to schooldb
const sequelize = new Sequelize('postgres://localhost/schooldb', { 
  logging: false 
});

// Define models inline
const User = sequelize.define('User', {
  name: { type: Sequelize.DataTypes.STRING },
  email: { type: Sequelize.DataTypes.STRING, unique: true, allowNull: false },
  password: { type: Sequelize.DataTypes.STRING, allowNull: false },
  role: { type: Sequelize.DataTypes.ENUM('admin', 'teacher', 'parent', 'student'), allowNull: false }
});

const Student = sequelize.define('Student', {
  name: { type: Sequelize.DataTypes.STRING },
  class: { type: Sequelize.DataTypes.STRING },
  section: { type: Sequelize.DataTypes.STRING },
  parent_id: { type: Sequelize.DataTypes.INTEGER, allowNull: true },
  user_id: { type: Sequelize.DataTypes.INTEGER, allowNull: true }
});

// Define associations
Student.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
User.hasOne(Student, { as: 'studentRecord', foreignKey: 'user_id' });

async function linkStudentUsersToRecords() {
  try {
    console.log('🔍 Checking student users and records...');
    
    // Get all student users
    const studentUsers = await User.findAll({
      where: { role: 'student' },
      attributes: ['id', 'name', 'email']
    });
    
    console.log('\n=== STUDENT USERS ===');
    studentUsers.forEach(user => {
      console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
    });
    
    // Get all student records
    const studentRecords = await Student.findAll({
      attributes: ['id', 'name', 'class', 'section', 'parent_id', 'user_id']
    });
    
    console.log('\n=== STUDENT RECORDS ===');
    studentRecords.forEach(record => {
      console.log(`ID: ${record.id}, Name: ${record.name}, Class: ${record.class} ${record.section}, Parent ID: ${record.parent_id}, User ID: ${record.user_id}`);
    });
    
    console.log('\n🔗 Linking student users to records by name...');
    
    let linkedCount = 0;
    for (const user of studentUsers) {
      // Find matching student record by name
      const matchingRecord = studentRecords.find(record => 
        record.name.toLowerCase().trim() === user.name.toLowerCase().trim()
      );
      
      if (matchingRecord && !matchingRecord.user_id) {
        await matchingRecord.update({ user_id: user.id });
        console.log(`✅ Linked ${user.name} (User ID: ${user.id}) → Student Record ID: ${matchingRecord.id}`);
        linkedCount++;
      } else if (matchingRecord && matchingRecord.user_id) {
        console.log(`ℹ️ ${user.name} already linked (User ID: ${user.id} → Student Record ID: ${matchingRecord.id})`);
      } else {
        console.log(`⚠️ No matching student record found for user: ${user.name}`);
      }
    }
    
    console.log(`\n🎉 Linked ${linkedCount} new connections!`);
    
    // Show final status
    const updatedRecords = await Student.findAll({
      where: { user_id: { [require('sequelize').Op.not]: null } },
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
    });
    
    console.log('\n=== FINAL LINKED RECORDS ===');
    updatedRecords.forEach(record => {
      console.log(`Student: ${record.name} (${record.class} ${record.section}) ↔ User: ${record.user?.name} (${record.user?.email})`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

linkStudentUsersToRecords();
