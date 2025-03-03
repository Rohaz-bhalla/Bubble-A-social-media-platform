const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');


//home
router.get('/', (req, res) => res.render('home', { user: res.locals.user }));

// Signup & Login
router.get('/signup', (req, res) => res.render('signup', { error: null, user: res.locals.user }));
router.post('/signup', userController.signup);

router.get('/login', (req, res) => res.render('login', { error: null, user: res.locals.user }));
router.post('/login', userController.login);

//profile 
router.get('/profile', verifyToken, userController.getProfile);
router.get('/profile/edit', verifyToken, userController.getEditProfile);
router.post('/profile/edit', verifyToken, userController.updateProfile);


//Logout 
router.get('/logout', userController.logout);

module.exports = router;
