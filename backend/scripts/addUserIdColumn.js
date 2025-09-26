require('dotenv').config();
const { sequelize } = require('../config/postgres');

const addUserIdColumn = async () => {
  try {
    console.log('🔧 Adding user_id column to Students table...');
    
    // Check if we can connect using the existing connection from the running server
    const queryInterface = sequelize.getQueryInterface();
    
    try {
      // Try to add the column
      await queryInterface.addColumn('Students', 'user_id', {
        type: sequelize.Sequelize.DataTypes.INTEGER,
        allowNull: true
      });
      console.log('✅ user_id column added successfully!');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ user_id column already exists!');
      } else {
        throw error;
      }
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error adding user_id column:', error.message);
    process.exit(1);
  }
};

addUserIdColumn();
