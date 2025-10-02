const { sequelize, Assignment, AssignmentSubmission } = require('../models/postgres');

async function createAssignmentTables() {
  try {
    console.log('Creating Assignment tables...');
    
    // Create assignments table
    await Assignment.sync({ force: false });
    console.log('✅ Assignment table created/verified');
    
    // Create assignment_submissions table
    await AssignmentSubmission.sync({ force: false });
    console.log('✅ AssignmentSubmission table created/verified');
    
    console.log('🎉 Assignment tables setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating assignment tables:', error);
    process.exit(1);
  }
}

createAssignmentTables();
