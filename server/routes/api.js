const express = require('express');
const router = express.Router();
const { getTestData, getPocketData, getYouTubeData } = require('../controllers/apiController');

router.get('/test', getTestData);
router.get('/pocket', getPocketData);
router.get('/youtube', getYouTubeData);

module.exports = router;