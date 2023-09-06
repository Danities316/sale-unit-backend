// routes/businessRoutes.js
const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const { switchTenant } = require('../middleware/tenantMiddleware');
const authenticateJWT = require('../middleware/jwtMiddleware');

router.use(authenticateJWT);
router.use(switchTenant);

router.post('/', businessController.createBusiness);
router.get('/', businessController.getAllBusinesses);
router.get('/:id', businessController.getBusinessById);
router.put('/:id', businessController.updateBusinessById);
router.delete('/:id', businessController.deleteBusinessById);

module.exports = router;
