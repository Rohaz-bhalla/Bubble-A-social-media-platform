const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");

// Signup
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email is already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

        const [newUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const token = jwt.sign({ id: newUser[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error signing up' });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error logging in' });
    }
};

// Logout
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [res.locals.user.id]);

        if (!user.length) {
            return res.status(404).send("User not found!");
        }

        res.render("profile", { 
            title: "Profile",
            user: user[0] 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        console.log("Updating profile...");

        // Ensure user is authenticated
        const userId = res.locals.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        console.log("User ID:", userId);
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { username } = req.body;
        let profilePicPath = null;

        // If a file is uploaded, set profilePicPath
        if (req.file) {
            profilePicPath = `/uploads/profilePics/${req.file.filename}`;
            console.log("New Profile Pic Path:", profilePicPath);
        }

        // Build update query
        let updateFields = [];
        let updateValues = [];

        if (username) {
            updateFields.push("username = ?");
            updateValues.push(username);
        }

        if (profilePicPath) {
            updateFields.push("profilePic = ?");
            updateValues.push(profilePicPath);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: "No data to update" });
        }

        updateValues.push(userId);
        const updateQuery = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;

        await pool.query(updateQuery, updateValues);

        console.log("Profile updated successfully!");

        res.json({ success: true, profilePic: profilePicPath, username: username });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getEditProfile = async (req, res) => {
    try {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [res.locals.user.id]);

        if (!user.length) {
            return res.status(404).send("User not found!");
        }

        res.render("editProfile", { 
            title: "Edit Profile",
            user: user[0],
            error: null // ✅ Fix: Ensure 'error' is always defined
        });
    } catch (error) {
        console.error(error);
        res.status(500).render("editProfile", { 
            title: "Edit Profile",
            user: res.locals.user, 
            error: "Server Error! Try again." // ✅ Fix: Pass error message
        });
    }
};


// Multer Setup for Profile Picture Uploads
const storage = multer.diskStorage({
    destination: "./public/uploads/profilePics",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    },
});
const upload = multer({ storage });

// Upload Profile Picture Middleware
exports.uploadProfilePicture = upload.single("profilePic");
