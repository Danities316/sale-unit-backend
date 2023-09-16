const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// Middleware for authentication and authorization would be added here.

router.post('/', purchaseController.createPurchase);
router.get('/:tenantId', purchaseController.retrievePurchases);
router.put('/:id', purchaseController.updatePurchase);
router.delete('/:id', purchaseController.deletePurchase);

module.exports = router;
