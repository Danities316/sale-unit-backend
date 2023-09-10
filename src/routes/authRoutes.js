const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authenticateJWT = require('../middleware/jwtMiddleware');
const { switchTenant } = require('../middleware/tenantMiddleware');

// Registration route
router.post('/register', AuthController.registerUser);

// Phone number verification route
router.post('/verify-phone', AuthController.verifyPhoneNumber);

// Update user route
router.post('/update-user', authenticateJWT, AuthController.updateUserInfo);

// Login route
router.post('/login', AuthController.loginUser);

// Forgot password route
router.post('/forgot-password', AuthController.forgotPassword);

router.get("/test", authenticateJWT, switchTenant, AuthController.test);

module.exports = router;
