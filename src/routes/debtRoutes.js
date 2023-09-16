// routes/debtRoutes.js
const express = require('express');
const router = express.Router();
const debtController = require('../controllers/debtControlller');

router.post('/', debtController.createDebt);
router.get('/:tenantId', debtController.retrieveDebts);
router.put('/:id', debtController.updateDebt);
router.delete('/:id', debtController.deleteDebt);

module.exports = router;
