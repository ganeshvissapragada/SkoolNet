require('dotenv').config();
const { Assignment } = require('../models/postgres');

async function publishAssignment() {
  try {
    console.log('📝 Publishing assignment...');
    
    const [updatedCount] = await Assignment.update(
      { status: 'published' },
      { 
        where: { 
          status: 'draft' 
        } 
      }
    );
    
    console.log(`✅ Updated ${updatedCount} assignment(s) to published status`);
    
    // Verify the update
    const assignments = await Assignment.findAll({
      attributes: ['id', 'title', 'status']
    });
    
    console.log('\n📋 Current assignments:');
    assignments.forEach(assignment => {
      console.log(`- ${assignment.title}: ${assignment.status}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

publishAssignment();
