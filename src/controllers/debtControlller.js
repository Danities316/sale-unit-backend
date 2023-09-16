// controllers/debtController.js
const { Debt } = require('../../models');

// Create a Debt
exports.createDebt = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const { businessId, customerId } = req.params.id;

    const debt = await Debt.create(amount, description, customerId);
    return res.status(201).json(debt);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating debt.' });
  }
};

// Retrieve Debts for a Tenant
exports.retrieveDebts = async (req, res) => {
  const { businessId, customerId } = req.params.id;

  try {
    const debts = await Debt.findAll({
      where: { customerId },
    });
    return res.json(debts);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving debts.' });
  }
};

// Update Debt
exports.updateDebt = async (req, res) => {
  const { id } = req.params;

  try {
    const [updatedRows] = await Debt.update(req.body, {
      where: { id },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Debt not found.' });
    }

    const updatedDebt = await Debt.findByPk(id);
    return res.json(updatedDebt);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating debt.' });
  }
};

// Delete Debt
exports.deleteDebt = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRowCount = await Debt.destroy({
      where: { id },
    });

    if (deletedRowCount === 0) {
      return res.status(404).json({ error: 'Debt not found.' });
    }

    return res.json({ message: 'Debt deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting debt.' });
  }
};
