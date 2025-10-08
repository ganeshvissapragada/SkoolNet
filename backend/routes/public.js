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

// Public API endpoint to get all albums
router.get('/albums', (req, res) => {
  try {
    res.json(landingPageData.albums);
  } catch (error) {
    console.error('Error getting albums:', error);
    res.status(500).json({ error: 'Failed to get albums' });
  }
});

// Public API endpoint to get a specific album
router.get('/albums/:id', (req, res) => {
  try {
    const albumId = parseInt(req.params.id);
    const album = landingPageData.albums.find(album => album.id === albumId);
    
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    res.json(album);
  } catch (error) {
    console.error('Error getting album:', error);
    res.status(500).json({ error: 'Failed to get album' });
  }
});

module.exports = router;