const express = require('express');
const router = express.Router();
const PurchaseController = require('../controllers/purchaseController');
const authorizeBusinessAccess = require('../middleware/jwtMiddleware');

// POST /api/purchases/:businessId (Create Purchase for a Business)
router.post(
  '/:businessId',
  authorizeBusinessAccess,
  PurchaseController.createPurchase,
);

// GET /api/purchases/:businessId (Get All Purchases for a Business)
router.get(
  '/:businessId',
  authorizeBusinessAccess,
  PurchaseController.getAllPurchases,
);

// GET /api/purchases/:businessId/:id (Get a Purchase by ID for a Business)
router.get(
  '/:businessId/:id',
  authorizeBusinessAccess,
  PurchaseController.getPurchaseById,
);

// PUT /api/purchases/:businessId/:id (Update a Purchase by ID for a Business)
router.put(
  '/:businessId/:id',
  authorizeBusinessAccess,
  PurchaseController.updatePurchaseById,
);

// DELETE /api/purchases/:businessId/:id (Delete a Purchase by ID for a Business)
router.delete(
  '/:businessId/:id',
  authorizeBusinessAccess,
  PurchaseController.deletePurchaseById,
);

module.exports = router;
