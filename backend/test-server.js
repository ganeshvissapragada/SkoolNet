const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Simple test data
const testData = {
  schoolInfo: {
    name: 'Test School',
    description: 'Test Description',
    logo: null,
    backgroundImage: null
  },
  stats: [
    { label: 'Students', value: 1000, icon: 'users' }
  ],
  teachers: [],
  albums: [],
  carousel: []
};

// Test endpoint
app.get('/api/landing-page-data', (req, res) => {
  console.log('Public landing page data requested');
  res.json(testData);
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
