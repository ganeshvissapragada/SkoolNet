const { Sequelize } = require('sequelize');
require('dotenv').config();

// Quick connection test with better error handling
async function quickTest() {
  console.log('🔍 Quick Supabase Connection Test');
  console.log('=================================');
  
  const config = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 5432,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD ? '***hidden***' : 'NOT SET'
  };
  
  console.log('📋 Connection config:');
  Object.entries(config).forEach(([key, value]) => {
    console.log(`   ${key}: ${value || 'NOT SET'}`);
  });
  
  if (!process.env.PG_HOST || !process.env.PG_PASSWORD) {
    console.log('\n❌ Missing required environment variables!');
    console.log('   Make sure PG_HOST and PG_PASSWORD are set in .env');
    return;
  }
  
  const sequelize = new Sequelize(
    process.env.PG_DB,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  );

  try {
    console.log('\n🔗 Attempting connection...');
    await sequelize.authenticate();
    console.log('✅ SUCCESS! Database connected!');
    
    // Quick table check
    const [tables] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    console.log(`📊 Found ${tables.length} tables in database`);
    
    await sequelize.close();
    console.log('\n🎉 Connection test PASSED!');
    console.log('   You can now run: node check-db-status.js');
    
  } catch (error) {
    console.log('\n❌ Connection FAILED:');
    console.log(`   Error: ${error.message}`);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 DNS Resolution Failed - Check:');
      console.log('   • Correct project reference in PG_HOST');
      console.log('   • Project is active in Supabase dashboard');
      console.log('   • Try connection pooling (port 6543)');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Authentication Failed - Check:');
      console.log('   • Database password is correct');
      console.log('   • User permissions are set properly');
    }
  }
}

quickTest();
