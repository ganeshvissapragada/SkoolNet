const express = require('express');
const router = express.Router();
const landingPageData = require('../controllers/landingPageDataStore');

// Public API endpoint to get landing page data
router.get('/landing-page-data', (req, res) => {
  try {
    res.json(landingPageData);
  } catch (error) {
    console.error('Error getting landing page data:', error);
    res.status(500).json({ error: 'Failed to get landing page data' });
  }
});

module.exports = router;