// Simple test to check classes and subjects data
const api = require('../api/api.js');

async function testAPI() {
  try {
    console.log('Testing API call to /teacher/classes-subjects...');
    
    // First, let's try to make the API call directly
    const response = await fetch('http://localhost:3001/api/teacher/classes-subjects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Note: This won't work without proper authentication, but let's see what error we get
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data);
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testAPI();
