// controllers/inventoryController.js
const { Inventory } = require('../../models');

// Create an Inventory Item
exports.createInventoryItem = async (req, res) => {
  try {
    // Extract necessary data from req.body
    const { name, description, quantity, price } = req.body;
    const { tenantId, businessId } = req.user; // Assuming you have user context with tenantId and businessId

    // Authenticate and authorize the user (Implement this logic based on your authentication system)

    // Create a new inventory item record in the database
    const inventoryItem = await Inventory.create({
      name,
      description,
      quantity,
      price,
      tenantId,
      businessId,
    });

    return res.status(201).json(inventoryItem);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating inventory item.' });
  }
};

/ Retrieve Inventory for a Tenant
exports.retrieveInventoryItems = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { businessId } = req.user; 

    // Authenticate and authorize the user
    // Ensure that the authenticated user has access to the specified tenant's data

    // Fetch inventory items based on tenantId and businessId
    const inventoryItems = await Inventory.findAll({
      where: { tenantId, businessId },
    });

    return res.json(inventoryItems);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving inventory items.' });
  }
};

// Update Inventory Item
exports.updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, quantity, price } = req.body;
    const { businessId } = req.user; 

    // Authenticate and authorize the user ur authentication
    // Ensure that the authenticated user has access to modify the inventory item

    // Update the inventory item record in the database
    const [updatedRows] = await Inventory.update(
      { name, description, quantity, price },
      { where: { id, businessId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Inventory item not found or unauthorized.' });
    }

    const updatedInventoryItem = await Inventory.findByPk(id);
    return res.json(updatedInventoryItem);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating inventory item.' });
  }
};

/ Delete Inventory Item
exports.deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessId } = req.user; // Assuming you have user context with businessId

    // Authenticate and authorize the user (Implement this logic based on your authentication system)
    // Ensure that the authenticated user has access to delete the inventory item

    // Delete the inventory item record from the database
    const deletedRowCount = await Inventory.destroy({
      where: { id, businessId },
    });

    if (deletedRowCount === 0) {
      return res.status(404).json({ error: 'Inventory item not found or unauthorized.' });
    }

    return res.json({ message: 'Inventory item deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting inventory item.' });
  }
};