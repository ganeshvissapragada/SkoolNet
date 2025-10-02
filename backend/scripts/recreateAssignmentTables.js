const { sequelize, Assignment, AssignmentSubmission } = require('../models/postgres');

async function recreateAssignmentTables() {
  try {
    console.log('Recreating Assignment tables with correct column names...');
    
    // Drop and recreate assignments table
    await Assignment.sync({ force: true });
    console.log('✅ Assignment table recreated with underscored columns');
    
    // Drop and recreate assignment_submissions table
    await AssignmentSubmission.sync({ force: true });
    console.log('✅ AssignmentSubmission table recreated with underscored columns');
    
    console.log('🎉 Assignment tables recreated successfully with snake_case columns!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error recreating assignment tables:', error);
    process.exit(1);
  }
}

recreateAssignmentTables();
