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

// ✅ Create a new bubble
exports.createBubble = async (req, res) => {
    try {
        const { name, description, privacy } = req.body;
        const creatorId = req.user.id;

        if (!name || !description || !privacy) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Insert bubble into the database
        const [result] = await pool.query(
            "INSERT INTO bubbles (name, description, privacy, creator_id) VALUES (?, ?, ?, ?)",
            [name, description, privacy, creatorId]
        );

        res.status(201).json({ message: "Bubble created successfully!", bubbleId: result.insertId });
    } catch (error) {
        console.error("Error creating bubble:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ Join a bubble
exports.joinBubble = async (req, res) => {
    try {
        const bubbleId = req.params.id;
        const userId = req.user.id;

        // Check if user is already in the bubble
        const [existing] = await pool.query(
            "SELECT * FROM user_bubbles WHERE user_id = ? AND bubble_id = ?",
            [userId, bubbleId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: "You have already joined this bubble." });
        }

        // Add user to the bubble
        await pool.query("INSERT INTO user_bubbles (user_id, bubble_id) VALUES (?, ?)", [userId, bubbleId]);

        res.json({ message: "Joined bubble successfully!" });
    } catch (error) {
        console.error("Error joining bubble:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ Get all bubbles
exports.getAllBubbles = async (req, res) => {
    try {
        const [bubbles] = await pool.query("SELECT * FROM bubbles");
        res.json(bubbles);
    } catch (error) {
        console.error("Error fetching bubbles:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ Get a specific bubble
exports.getBubbleById = async (req, res) => {
    try {
        const bubbleId = req.params.id;
        const [bubble] = await pool.query("SELECT * FROM bubbles WHERE id = ?", [bubbleId]);

        if (bubble.length === 0) {
            return res.status(404).json({ error: "Bubble not found" });
        }

        res.json(bubble[0]);
    } catch (error) {
        console.error("Error fetching bubble:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};