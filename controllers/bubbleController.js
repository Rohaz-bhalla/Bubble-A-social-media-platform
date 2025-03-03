const pool = require('../config/db');

// Create a bubble
exports.createBubble = async (req, res) => {
    const { name, description, rules } = req.body;
    const creatorId = req.user.id; // Assuming user is authenticated
    try {
        await pool.query('INSERT INTO bubbles (name, description, rules, creator_id) VALUES (?, ?, ?, ?)',
            [name, description, rules, creatorId]);
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error creating bubble');
    }
};

// View a bubble
exports.viewBubble = async (req, res) => {
    const { id } = req.params;
    try {
        const [bubble] = await pool.query('SELECT * FROM bubbles WHERE id = ?', [id]);
        res.render('bubble', { bubble: bubble[0] });
    } catch (err) {
        res.status(500).send('Error fetching bubble');
    }
};