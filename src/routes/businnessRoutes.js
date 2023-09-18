// routes/businessRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const businessController = require('../controllers/businessController');
const { switchTenant } = require('../middleware/tenantMiddleware');
const authenticateJWT = require('../middleware/jwtMiddleware');

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

router.use(authenticateJWT);
router.use(switchTenant);

router.post('/', upload.single('image'), businessController.createBusiness);
router.get('/', businessController.getAllBusinesses);
router.get('/:id', businessController.getBusinessById);
router.put(
  '/:id',
  upload.single('image'),
  businessController.updateBusinessById,
);
router.delete('/:id', businessController.deleteBusinessById);

module.exports = router;
