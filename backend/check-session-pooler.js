const { Client } = require('pg');
require('dotenv').config();

async function checkSupabaseSessionPooler() {
  const config = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 6543,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    }
  };

  console.log('🔄 Testing Supabase Session Pooler connection...');
  console.log('Configuration:', {
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    ssl: config.ssl
  });

  const client = new Client(config);

  try {
    await client.connect();
    console.log('✅ Successfully connected to Supabase via Session Pooler!');

    // Check database version
    const versionResult = await client.query('SELECT version()');
    console.log('📊 PostgreSQL Version:', versionResult.rows[0].version);

    // List all tables
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

    // Check table row counts
    const tables = tablesResult.rows.map(row => row.table_name);
    
    console.log('\n📊 Table Row Counts:');
    for (const table of tables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) FROM "${table}"`);
        console.log(`  ${table}: ${countResult.rows[0].count} rows`);
      } catch (error) {
        console.log(`  ${table}: Error counting rows - ${error.message}`);
      }
    }

    // Test a simple query to users table
    try {
      const usersResult = await client.query('SELECT id, email, role FROM "Users" LIMIT 5');
      console.log('\n👥 Sample Users:');
      usersResult.rows.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`);
      });
    } catch (error) {
      console.log('\n❌ Error querying Users table:', error.message);
    }

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.end();
  }
}

checkSupabaseSessionPooler();
