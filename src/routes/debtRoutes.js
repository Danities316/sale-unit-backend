const express = require('express');
const router = express.Router();
const debtController = require('../controllers/debtControlller');
const authenticateJWT = require('../middleware/jwtMiddleware');

// Create a new debt record
router.post('/debts', authenticateJWT, debtController.createDebt);

// Get all debts for a specific business
router.get('/', authenticateJWT, debtController.getAllDebts);

// Get a debt by ID
router.get('/:id', authenticateJWT, debtController.getDebtById);

// Update a debt by ID
router.put('/:id', authenticateJWT, debtController.updateDebtById);

// Delete a debt by ID
router.delete('/:id', authenticateJWT, debtController.deleteDebtById);

module.exports = router;
