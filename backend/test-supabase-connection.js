const { Sequelize } = require('sequelize');
require('dotenv').config();

async function testConnection(host, description) {
  console.log(`\n🔍 Testing ${description}...`);
  console.log(`Host: ${host}`);
  
  const sequelize = new Sequelize(
    process.env.PG_DB,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
      host: host,
      port: process.env.PG_PORT,
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
    await sequelize.authenticate();
    console.log('✅ Connection successful!');
    
    // Test a simple query
    const [result] = await sequelize.query('SELECT NOW() as current_time');
    console.log(`⏰ Server time: ${result[0].current_time}`);
    
    await sequelize.close();
    return true;
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    return false;
  }
}

async function findCorrectHost() {
  console.log('🔍 Testing Supabase Connection Variations...');
  console.log('============================================');
  
  const currentHost = process.env.PG_HOST;
  console.log(`Current .env host: ${currentHost}`);
  
  // Extract project ref if possible
  const projectRef = currentHost.includes('.') ? 
    currentHost.split('.')[1] : 'vjlozlmvvvhcyfdqepuz';
  
  const hostsToTest = [
    // Current host
    currentHost,
    
    // Alternative formats
    `db.${projectRef}.supabase.co`,
    `aws-0-${process.env.PG_HOST.replace('db.', '')}`,
    
    // Without db prefix
    `${projectRef}.supabase.co`,
    
    // Direct IP (if DNS fails)
    // Note: We'll try to resolve this
  ];
  
  console.log(`\nProject reference detected: ${projectRef}`);
  console.log('Testing these host variations:');
  hostsToTest.forEach((host, i) => {
    console.log(`${i + 1}. ${host}`);
  });
  
  for (let i = 0; i < hostsToTest.length; i++) {
    const host = hostsToTest[i];
    const success = await testConnection(host, `Variation ${i + 1}`);
    
    if (success) {
      console.log('\n🎉 SUCCESS! Working connection found!');
      console.log(`✅ Use this host: ${host}`);
      console.log('\n📝 Update your .env file with:');
      console.log(`PG_HOST=${host}`);
      return;
    }
  }
  
  console.log('\n❌ No working connection found.');
  console.log('\n🔧 Troubleshooting steps:');
  console.log('1. Verify your Supabase project is active');
  console.log('2. Check your database password is correct');
  console.log('3. Ensure your IP is allowed (if IP restrictions are enabled)');
  console.log('4. Try connecting from Supabase dashboard first');
}

findCorrectHost().catch(console.error);
