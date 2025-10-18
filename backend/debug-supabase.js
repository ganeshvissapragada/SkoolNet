#!/usr/bin/env node

// Script to help debug Supabase connection issues
const dns = require('dns');
const { Client } = require('pg');

async function debugConnection() {
  console.log('🔍 Debugging Supabase Connection Issues');
  console.log('=====================================\n');
  
  const currentHost = 'db.vjlozlmvvvhcyfdqepuz.supabase.co';
  
  // Test DNS resolution
  console.log('1. Testing DNS Resolution...');
  try {
    const addresses = await new Promise((resolve, reject) => {
      dns.resolve4(currentHost, (err, addresses) => {
        if (err) reject(err);
        else resolve(addresses);
      });
    });
    console.log(`✅ DNS resolves to: ${addresses.join(', ')}`);
  } catch (error) {
    console.log(`❌ DNS resolution failed: ${error.message}`);
    console.log('   This usually means:');
    console.log('   - The Supabase project has been paused/deleted');
    console.log('   - The project reference has changed');
    console.log('   - There\'s a typo in the URL');
  }
  
  console.log('\n2. Checking Common Supabase Patterns...');
  
  // Check if it's a valid Supabase pattern
  const supabasePattern = /^db\.([a-z0-9]+)\.supabase\.co$/;
  const match = currentHost.match(supabasePattern);
  
  if (match) {
    const projectRef = match[1];
    console.log(`✅ Valid Supabase pattern detected`);
    console.log(`   Project Reference: ${projectRef}`);
    console.log(`   Length: ${projectRef.length} characters`);
  } else {
    console.log(`❌ Invalid Supabase URL pattern`);
  }
  
  console.log('\n3. Suggested Actions:');
  console.log('   → Check your Supabase dashboard');
  console.log('   → Go to Settings → Database');
  console.log('   → Copy the correct connection parameters');
  console.log('   → Update your .env file');
  
  console.log('\n4. Expected Format:');
  console.log('   PG_HOST=db.YOUR-PROJECT-REF.supabase.co');
  console.log('   PG_USER=postgres');
  console.log('   PG_DB=postgres');
  console.log('   PG_PASSWORD=your-password');
  console.log('   PG_PORT=5432');
}

debugConnection().catch(console.error);
