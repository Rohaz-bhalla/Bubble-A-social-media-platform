const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userRoutes = require('./routes/userRoutes');
const bubbleRoutes = require('./routes/bubbleRoutes');
const postRoutes = require('./routes/postRoutes');
const reactionRoutes = require('./routes/reactionRoutes');
const whisperRoutes = require('./routes/whisperRoutes');
const gratitudeRoutes = require('./routes/gratitudeRoutes');
const offlineRoutes = require('./routes/offlineRoutes');
const { verifyToken } = require('./middleware/authMiddleware');

// Set view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    try {
        res.locals.user = req.cookies.token ? jwt.verify(req.cookies.token, process.env.JWT_SECRET) : null;
    } catch (err) {
        res.locals.user = null;
    }
    next();
});

// Routes
app.use('/', userRoutes);
app.use('/bubbles', verifyToken, bubbleRoutes);
app.use('/posts', verifyToken, postRoutes);
app.use('/reactions', verifyToken, reactionRoutes);
app.use('/whisper', verifyToken, whisperRoutes);
app.use('/gratitude', verifyToken, gratitudeRoutes);
app.use('/offline', verifyToken, offlineRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
