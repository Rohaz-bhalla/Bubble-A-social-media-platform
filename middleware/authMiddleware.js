const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login'); // Redirect if not logged in
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store user in request
        next();
    } catch (err) {
        res.clearCookie('token');
        res.redirect('/login');
    }
};
