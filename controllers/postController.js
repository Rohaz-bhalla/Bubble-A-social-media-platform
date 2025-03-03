const pool = require('../config/db');

// Create a post
exports.createPost = async (req, res) => {
    const { content, bubbleId } = req.body;
    const userId = req.user.id; // Assuming user is authenticated
    try {
        await pool.query('INSERT INTO posts (content, user_id, bubble_id) VALUES (?, ?, ?)',
            [content, userId, bubbleId]);
        res.redirect(`/bubbles/${bubbleId}`);
    } catch (err) {
        res.status(500).send('Error creating post');
    }
};