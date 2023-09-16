// controllers/customerController.js
const { Customer } = require('../../models');
const { Sequelize } = require('sequelize');
const defineCustomersModel = require('../../models/customerModel');
const defineBusinessModel = require('../../models/businessModel');

// Create a Customer
exports.createCustomer = async (req, res) => {
  const { tenantSequelize } = req; // Get the tenant-specific Sequelize instance
  const userId = req.user.userId;
  const businessId = req.params.id;

  try {
    const { name, Phone } = req.body;

    // Define the Business model for the current tenant
    const CustomerModel = defineCustomersModel(tenantSequelize);
    const customer = await CustomerModel.create({
      name,
      Phone,
      businessId,
    });
    return res.status(201).json(customer);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating customer.' });
  }
};

// Retrieve Customers for a Tenant
exports.retrieveCustomers = async (req, res) => {
  const businessId = req.params;

  try {
    const CustomerModel = defineCustomersModel(tenantSequelize);
    const customers = await CustomerModel.findAll({
      where: { businessId: businessId },
    });
    return res.json(customers);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving customers.' });
  }
};

// Update Customer
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const [updatedRows] = await Customer.update(req.body, {
      where: { id },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const updatedCustomer = await Customer.findByPk(id);
    return res.json(updatedCustomer);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating customer.' });
  }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRowCount = await Customer.destroy({
      where: { id },
    });

    if (deletedRowCount === 0) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    return res.json({ message: 'Customer deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting customer.' });
  }
};
