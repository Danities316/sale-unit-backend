const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
// const UserController = require('../controllers/authController');
const AuthController = require('../controllers/AuthController');
// const authenticateJWT = require('../middleware/jwtMiddleware');
// Registration route
router.post('/register', AuthController.registerUser);

// Login route
router.post('/login', AuthController.loginUser);

// Phone number verification route
router.post('/verify-phone', AuthController.verifyPhoneNumber);

// Forgot password route
router.post('/forgot-password', AuthController.forgotPassword);

module.exports = router;
