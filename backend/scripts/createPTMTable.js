const { sequelize, PTM } = require('../models/postgres');

async function createPTMTable() {
  try {
    console.log('Creating PTM table...');
    
    // Sync the PTM model to create the table
    await PTM.sync({ force: false });
    
    console.log('PTM table created successfully!');
  } catch (error) {
    console.error('Error creating PTM table:', error);
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  createPTMTable()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { createPTMTable };
