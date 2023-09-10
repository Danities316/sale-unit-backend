const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { switchTenant } = require('../middleware/tenantMiddleware');
const authenticateJWT = require('../middleware/jwtMiddleware');

router.use(authenticateJWT);
router.use(switchTenant);

// Define routes for CRUD operations
router.post('/', salesController.createSaleBusiness);
router.get('/', salesController.getSalesForBusiness);
router.get('/:id', salesController.getSaleById);
router.put('/:id', salesController.updateSale);
router.delete('/:id', salesController.deleteSale);

module.exports = router;
