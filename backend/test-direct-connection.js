#!/usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

console.log('🔍 Testing Direct PostgreSQL Connection...');
console.log('=====================================');

const client = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DB,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log(`🔗 Attempting to connect to: ${process.env.PG_HOST}:${process.env.PG_PORT}`);
    console.log(`📊 Database: ${process.env.PG_DB}`);
    console.log(`👤 User: ${process.env.PG_USER}`);
    
    await client.connect();
    console.log('✅ Direct PostgreSQL connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL Version:', result.rows[0].version);
    
    // Check if tables exist
    const tableQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const tables = await client.query(tableQuery);
    console.log(`📋 Found ${tables.rows.length} tables in public schema:`);
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('🔍 Error details:', {
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      hostname: error.hostname
    });
  } finally {
    await client.end();
  }
}

testConnection();
