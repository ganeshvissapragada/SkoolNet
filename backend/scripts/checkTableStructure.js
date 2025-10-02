const { sequelize } = require('../models/postgres');

async function checkTableStructure() {
  try {
    console.log('Checking assignments table structure...');
    
    // Query to check table columns
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'assignments'
      ORDER BY ordinal_position;
    `);
    
    console.log('Assignment table columns:');
    results.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Try to get a sample record to see actual column names
    const [sampleData] = await sequelize.query('SELECT * FROM assignments LIMIT 1');
    console.log('\nSample data structure:', Object.keys(sampleData[0] || {}));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking table structure:', error.message);
    process.exit(1);
  }
}

checkTableStructure();
