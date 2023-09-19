const defineDebtModel = require('../../models/debtModel');
// const defineBusinessModel = require('../../models/businessModel');

// Create a new debt record
exports.createDebt = async (req, res) => {
  const { tenantSequelize } = req;
  try {
    const {
      description,
      debtDate,
      amount,
      debtStatus,
      debtType,
      debtDueDate,
      customerId,
    } = req.body;
    const { businessId } = req.user; // Assuming you have user context with businessId

    // Define the Business model for the current tenant
    const Debt = defineDebtModel(tenantSequelize);
    const newDebt = await Debt.create({
      description,
      debtDate,
      amount,
      debtStatus,
      debtType,
      debtDueDate,
      businessId,
      customerId,
    });

    return res.status(201).json(newDebt);
  } catch (error) {
    console.error('Error creating debt:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all debts for a specific business
exports.getAllDebts = async (req, res) => {
  try {
    const { businessId } = req.user;
    const { tenantSequelize } = req;

    // Define the Business model for the current tenant
    const Debt = defineDebtModel(tenantSequelize);

    const debts = await Debt.findAll({
      where: { businessId },
    });

    return res.status(200).json(debts);
  } catch (error) {
    console.error('Error fetching debts:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a debt by ID
exports.getDebtById = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessId } = req.user; // Assuming you have user context with businessId
    const { tenantSequelize } = req;

    // Define the Business model for the current tenant
    const Debt = defineDebtModel(tenantSequelize);

    const debt = await Debt.findOne({
      where: { id, businessId },
    });

    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    return res.status(200).json(debt);
  } catch (error) {
    console.error('Error fetching debt by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a debt by ID
exports.updateDebtById = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, debtDate, amount, debtStatus, debtType, debtDueDate } =
      req.body;
    const { businessId } = req.user;
    const { tenantSequelize } = req;

    // Define the Business model for the current tenant
    const Debt = defineDebtModel(tenantSequelize);
    const [updated] = await Debt.update(
      {
        description,
        debtDate,
        amount,
        debtStatus,
        debtType,
        debtDueDate,
      },
      {
        where: { id, businessId },
      },
    );

    if (updated) {
      const updatedDebt = await Debt.findOne({
        where: { id, businessId },
      });
      return res.status(200).json(updatedDebt);
    }

    return res.status(404).json({ message: 'Debt not found' });
  } catch (error) {
    console.error('Error updating debt:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a debt by ID
exports.deleteDebtById = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessId } = req.user;
    const { tenantSequelize } = req;

    // Define the Business model for the current tenant
    const Debt = defineDebtModel(tenantSequelize);

    const deleted = await Debt.destroy({
      where: { id, businessId },
    });

    if (deleted) {
      return res.status(204).send('Debt has been deleted successfully');
    }

    return res.status(404).json({ message: 'Debt not found' });
  } catch (error) {
    console.error('Error deleting debt:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
