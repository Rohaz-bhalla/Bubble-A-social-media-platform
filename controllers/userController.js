const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

        //Auto-login after signup
        const [newUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const token = jwt.sign({ id: newUser[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error signing up' });
    }
};

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

//profile
exports.getProfile = async (req, res) => {
    try {
        const [userData] = await pool.query('SELECT id, username, email, created_at FROM users WHERE id = ?', [req.user.id]);
        if (userData.length === 0) return res.redirect('/login');

        res.render('profile', { user: userData[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading profile");
    }
};

exports.getEditProfile = async (req, res) => {
    try {
        const [userData] = await pool.query('SELECT id, username FROM users WHERE id = ?', [req.user.id]);
        res.render('editProfile', { user: userData[0], error: null });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading profile edit page");
    }
};

exports.updateProfile = async (req, res) => {
    const { username } = req.body;
    if (!username) return res.render('editProfile', { user: req.user, error: "Username cannot be empty." });

    try {
        await pool.query('UPDATE users SET username = ? WHERE id = ?', [username, req.user.id]);
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating profile");
    }
};


exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};
