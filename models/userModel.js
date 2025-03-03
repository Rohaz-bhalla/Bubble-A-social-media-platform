const pool = require('../config/db');

exports.createUser = async (username, email, password) => {
    const [result] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
        [username, email, password]);
    return result;
};

exports.findUserByEmail = async (email) => {
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return user[0];
};
