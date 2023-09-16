router.post('/', customerController.createCustomer);
router.get('/:tenantId/:businessId', customerController.retrieveCustomers);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
