const express = require('express');
const router = express.Router();
// const UserController = require('../controllers/authController');
const AuthController = require('../controllers/authController');
const authenticateJWT = require('../middleware/jwtMiddleware');
// Registration route
router.post('/register', AuthController.registerUser);


// Phone number verification route
router.post('/verify-phone', AuthController.verifyPhoneNumber);



// Login route
router.patch('/update-user', authenticateJWT, AuthController.updateUserInfo);

// Login route
router.post('/login', AuthController.loginUser);

// Forgot password route
router.post('/forgot-password', AuthController.forgotPassword);

module.exports = router;
