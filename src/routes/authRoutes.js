const express = require('express');
const router = express.Router();
// const UserController = require('../controllers/authController');
const AuthController = require('../controllers/authController');
const authenticateJWT = require('../middleware/jwtMiddleware');
<<<<<<< HEAD
const { switchTenant } = require('../middleware/tenantMiddleware');
=======
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
// Registration route
router.post('/register', AuthController.registerUser);

// Phone number verification route
router.post('/verify-phone', AuthController.verifyPhoneNumber);

// Login route
<<<<<<< HEAD
router.post('/update-user', authenticateJWT, AuthController.updateUserInfo);

// Login route
router.post('/login', AuthController.loginUser);
// router.post('/test', AuthController.test);
=======
router.patch('/update-user', authenticateJWT, AuthController.updateUserInfo);

// Login route
router.post('/login', AuthController.loginUser);
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c

// Forgot password route
router.post('/forgot-password', AuthController.forgotPassword);

<<<<<<< HEAD
router.post('/test', authenticateJWT, switchTenant, AuthController.tests);

=======
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
module.exports = router;
