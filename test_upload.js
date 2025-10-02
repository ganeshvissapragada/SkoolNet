const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function testUpload() {
  try {
    // Create a simple text file for testing
    const testContent = 'This is a test submission';
    fs.writeFileSync('/tmp/test.txt', testContent);

    // Create FormData
    const formData = new FormData();
    formData.append('submission_text', 'Test submission text');
    formData.append('attachments', fs.createReadStream('/tmp/test.txt'));

    console.log('Sending test upload...');
    
    // You'll need to replace this with a valid JWT token
    const token = 'your-jwt-token-here';
    
    const response = await axios.post('http://localhost:3001/api/student/assignments/1/submit', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testUpload();
