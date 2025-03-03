const express = require('express');
const router = express.Router();
const bubbleController = require('../controllers/bubbleController');

// Create a bubble
router.get('/create', (req, res) => res.render('createBubble'));
router.post('/create', bubbleController.createBubble);

// View a bubble
router.get('/:id', bubbleController.viewBubble);

module.exports = router;