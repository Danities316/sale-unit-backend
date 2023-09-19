const express = require('express');
const router = express.Router();
const multer = require('multer');
const customerController = require('../controllers/customerController');
const authorizeBusinessAccess = require('../middleware/jwtMiddleware');

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

router.post(
  '/:businessId',
  upload.single('image'),
  authorizeBusinessAccess,
  customerController.createCustomer,
);
router.get(
  '/:tenantId/:businessId',
  authorizeBusinessAccess,
  customerController.retrieveCustomers,
);
router.put(
  '/:id',
  upload.single('image'),
  authorizeBusinessAccess,
  customerController.updateCustomer,
);
router.delete(
  '/:id',
  authorizeBusinessAccess,
  customerController.deleteCustomer,
);

module.exports = router;
