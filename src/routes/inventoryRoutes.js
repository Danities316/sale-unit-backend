const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Middleware for authentication and authorization woulc be added here.

router.post('/', inventoryController.createInventoryItem);
router.get('/:tenantId', inventoryController.retrieveInventoryItems);
router.put('/:id', inventoryController.updateInventoryItem);
router.delete('/:id', inventoryController.deleteInventoryItem);

module.exports = router;
