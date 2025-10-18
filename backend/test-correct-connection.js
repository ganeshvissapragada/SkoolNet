const { Client } = require('pg');
require('dotenv').config();

async function testCorrectConnection() {
  // Using the correct connection string you provided
  const config = {
    host: 'aws-1-ap-south-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres.vjlozlmvvvhcyfdqepuz',
    password: 'f*L8QHa9V7u5dyN',
    ssl: {
      rejectUnauthorized: false
    }
  };

  console.log('🔄 Testing Correct Supabase Session Pooler Connection...');
  console.log('Configuration:', {
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user
  });

  const client = new Client(config);

  try {
    console.log('📡 Attempting to connect...');
    await client.connect();
    console.log('✅ SUCCESS! Connected to Supabase via Session Pooler!');

    // Test basic query
    const versionResult = await client.query('SELECT version()');
    console.log('📊 PostgreSQL Version:', versionResult.rows[0].version.substring(0, 50) + '...');

    // Test connection info
    const connInfo = await client.query('SELECT current_database(), current_user, inet_server_addr(), inet_server_port()');
    console.log('🔗 Connection Info:');
    console.log(`   Database: ${connInfo.rows[0].current_database}`);
    console.log(`   User: ${connInfo.rows[0].current_user}`);
    console.log(`   Server: ${connInfo.rows[0].inet_server_addr}:${connInfo.rows[0].inet_server_port}`);

    // List tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📋 Available Tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Check some table data
    console.log('\n📊 Table Row Counts:');
    for (const row of tablesResult.rows) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) FROM "${row.table_name}"`);
        console.log(`  ${row.table_name}: ${countResult.rows[0].count} rows`);
      } catch (error) {
        console.log(`  ${row.table_name}: Error - ${error.message}`);
      }
    }

    // Test Users table specifically
    try {
      const usersResult = await client.query('SELECT id, email, role FROM "Users" LIMIT 3');
      console.log('\n👥 Sample Users:');
      usersResult.rows.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`);
      });
    } catch (error) {
      console.log('\n❌ Error querying Users table:', error.message);
    }

    console.log('\n🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      severity: error.severity,
      detail: error.detail
    });
  } finally {
    await client.end();
  }
}

testCorrectConnection();
