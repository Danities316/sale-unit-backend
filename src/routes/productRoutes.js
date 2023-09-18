const express = require('express');
const router = express.Router();
const multer = require('multer');
const inventoryController = require('../controllers/productController');

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

// Middleware for authentication and authorization woulc be added here.

router.post('/', upload.single('image'), inventoryController.createProductItem);
router.get('/:tenantId', inventoryController.retrieveProductItems);
router.put(
  '/:id',
  upload.single('image'),
  inventoryController.updateProductItem,
);
router.delete('/:id', inventoryController.deleteProductItem);

module.exports = router;
