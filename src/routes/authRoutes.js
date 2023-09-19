const express = require('express');
const router = express.Router();
const multer = require('multer');
const AuthController = require('../controllers/authController');
const authenticateJWT = require('../middleware/jwtMiddleware');
const { switchTenant } = require('../middleware/tenantMiddleware');

//multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination folder for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

// Multer configuration for image upload
const upload = multer({
  storage: storage,
});

// Registration route
router.post('/register', AuthController.registerUser);

// Phone number verification route
router.post('/verify-phone', AuthController.verifyPhoneNumber);

// Update user route
router.post(
  '/update-user',
  upload.single('image'),
  authenticateJWT,
  AuthController.updateUserInfo,
);

// Login route
router.post('/login', AuthController.loginUser);

// Forgot password route
router.post('/forgot-password', AuthController.forgotPassword);

router.get('/test', authenticateJWT, switchTenant, AuthController.test);

module.exports = router;
