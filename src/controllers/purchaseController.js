// controllers/purchaseController.js
const { Purchase } = require('../models');

// Create a Purchase
exports.createPurchase = async (req, res) => {
  try {
    // Extract necessary data from req.body
    const { amount, description, tenantId, businessId } = req.body;

    // Authenticate and authorize the user (Implement this logic based on your authentication system)

    // Create a new purchase record in the database
    const purchase = await Purchase.create({
      amount,
      description,
      tenantId,
      businessId,
    });

    return res.status(201).json(purchase);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating purchase.' });
  }
};

// Retrieve Purchases for a Tenant
exports.retrievePurchases = async (req, res) => {
  const { tenantId } = req.params;

  try {
    // Fetch purchases based on tenantId
    const purchases = await Purchase.findAll({
      where: { tenantId },
    });

    return res.json(purchases);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving purchases.' });
  }
};

// Update Purchase
exports.updatePurchase = async (req, res) => {
  const { id } = req.params;

  try {
    // Extract updated data from req.body
    const { amount, description } = req.body;

    // Update the purchase record in the database
    const [updatedRows] = await Purchase.update(
      { amount, description },
      { where: { id } },
    );

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Purchase not found.' });
    }

    const updatedPurchase = await Purchase.findByPk(id);
    return res.json(updatedPurchase);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating purchase.' });
  }
};

// Delete Purchase
exports.deletePurchase = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the purchase record from the database
    const deletedRowCount = await Purchase.destroy({
      where: { id },
    });

    if (deletedRowCount === 0) {
      return res.status(404).json({ error: 'Purchase not found.' });
    }

    return res.json({ message: 'Purchase deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting purchase.' });
  }
};
