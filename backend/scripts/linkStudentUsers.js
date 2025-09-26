require('dotenv').config();
const { sequelize, User, Student } = require('../models/postgres');

const linkStudentUsersToRecords = async () => {
  try {
    console.log('🔗 Starting Student User to Record Linking...');
    
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');
    
    // Get all student users
    const studentUsers = await User.findAll({
      where: { role: 'student' }
    });
    
    console.log(`📚 Found ${studentUsers.length} student users`);
    
    // Get all student records without user_id
    const studentRecords = await Student.findAll({
      where: { 
        user_id: null 
      }
    });
    
    console.log(`📝 Found ${studentRecords.length} unlinked student records`);
    
    // Link by matching names
    let linkedCount = 0;
    for (const user of studentUsers) {
      const matchingRecord = studentRecords.find(record => 
        record.name.toLowerCase() === user.name.toLowerCase()
      );
      
      if (matchingRecord) {
        await matchingRecord.update({ user_id: user.id });
        console.log(`✅ Linked ${user.name} (User ID: ${user.id}) → Student Record ID: ${matchingRecord.id}`);
        linkedCount++;
      } else {
        console.log(`⚠️ No matching student record found for user: ${user.name}`);
      }
    }
    
    console.log(`\n🎉 Successfully linked ${linkedCount} student users to records!`);
    
    // Show final status
    const linkedRecords = await Student.findAll({
      where: { 
        user_id: { [require('sequelize').Op.not]: null }
      },
      include: [
        {
          model: User,
          attributes: ['name', 'email']
        }
      ]
    });
    
    console.log(`\n📊 Final Status:`);
    console.log(`🔗 Total linked student records: ${linkedRecords.length}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error linking student users to records:', error);
    process.exit(1);
  }
};

linkStudentUsersToRecords();
