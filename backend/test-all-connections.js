const { Client } = require('pg');
require('dotenv').config();

async function testMultipleConnections() {
  const baseConfig = {
    database: 'postgres',
    password: 'f*L8QHa9V7u5dyN',
    ssl: {
      rejectUnauthorized: false
    }
  };

  const connectionConfigs = [
    {
      name: 'Direct Connection (Original)',
      ...baseConfig,
      host: 'db.vjlozlmvvvhcyfdqepuz.supabase.co',
      port: 5432,
      user: 'postgres'
    },
    {
      name: 'Session Pooler (Standard Format)',
      ...baseConfig,
      host: 'aws-0-us-west-1.pooler.supabase.com',
      port: 6543,
      user: 'postgres.vjlozlmvvvhcyfdqepuz'
    },
    {
      name: 'Session Pooler (Project-specific)',
      ...baseConfig,
      host: 'vjlozlmvvvhcyfdqepuz.pooler.supabase.com',
      port: 6543,
      user: 'postgres.vjlozlmvvvhcyfdqepuz'
    },
    {
      name: 'Session Pooler (Alternative)',
      ...baseConfig,
      host: 'db.vjlozlmvvvhcyfdqepuz.supabase.co',
      port: 6543,
      user: 'postgres.vjlozlmvvvhcyfdqepuz'
    }
  ];

  for (const config of connectionConfigs) {
    console.log(`\n🔄 Testing: ${config.name}`);
    console.log(`   Host: ${config.host}:${config.port}`);
    console.log(`   User: ${config.user}`);
    
    const client = new Client(config);
    
    try {
      await client.connect();
      console.log('✅ SUCCESS! Connection established');
      
      // Quick test query
      const result = await client.query('SELECT current_database(), current_user');
      console.log(`   Database: ${result.rows[0].current_database}`);
      console.log(`   User: ${result.rows[0].current_user}`);
      
      await client.end();
      
      // If successful, update .env file
      console.log('\n🎉 Found working connection! Updating .env file...');
      return config;
      
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
      await client.end().catch(() => {});
    }
  }
  
  console.log('\n❌ All connection attempts failed');
  return null;
}

testMultipleConnections().then(workingConfig => {
  if (workingConfig) {
    console.log('\n✅ Working configuration found:', {
      host: workingConfig.host,
      port: workingConfig.port,
      user: workingConfig.user
    });
  }
});
