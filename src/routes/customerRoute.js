const express = require('express');
const router = express.Router();
const multer = require('multer');
const customerController = require('../controllers/customerController');

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

router.post('/', upload.single('image'), customerController.createCustomer);
router.get('/:tenantId/:businessId', customerController.retrieveCustomers);
router.put('/:id', upload.single('image'), customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
