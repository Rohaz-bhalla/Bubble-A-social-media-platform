const express = require('express');
const router = express.Router();
const bubbleController = require('../controllers/bubbleController');
const { verifyToken } = require("../middleware/authMiddleware");

// Create a bubble
router.get('/create', (req, res) => res.render('createBubble'));
router.post('/create', bubbleController.createBubble);

router.post("/create", verifyToken, bubbleController.createBubble);

// Join a bubble
router.post("/join/:id", verifyToken, bubbleController.joinBubble);

// Get all bubbles
router.get("/", verifyToken, bubbleController.getAllBubbles);

// Get a specific bubble
router.get("/:id", verifyToken, bubbleController.getBubbleById);


// View a bubble
router.get('/:id', bubbleController.viewBubble);

module.exports = router;