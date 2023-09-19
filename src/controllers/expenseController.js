const cloudinary = require('../../config/cloudinary');
const defineExpenseModel = require('../../models/expenseModel');
const defineNotificationModel = require('../../models/notificationModel');
// const Business =  require('../../models/businessModel');

// Create an Expense
exports.createExpense = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { tenantSequelize } = req;

    // logic to create an expense associated with the specified business
    const {
      productName,
      paidBy,
      expenseCategory,
      receiptImage,
      expenseDate,
      amount,
      quantity,
      description,
    } = req.body;

    const Expense = defineExpenseModel(tenantSequelize);

    const expense = await Expense.create({
      productName,
      paidBy,
      expenseCategory,
      receiptImage,
      expenseDate,
      amount,
      quantity,
      description,
      businessId, // Associate the expense with the specified business
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get All Expenses for a Business
exports.getAllExpenses = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { tenantSequelize } = req;

    // logic to fetch all expenses associated with the specified business

    const Expense = defineExpenseModel(tenantSequelize);

    const expenses = await Expense.findAll({
      where: { businessId }, // Filter expenses by the specified business ID
    });

    return res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get an Expense by ID for a Business
exports.getExpenseById = async (req, res) => {
  try {
    const { businessId, id } = req.params; // Get the business ID and expense ID from the route parameters
    const { tenantSequelize } = req;

    // logic to fetch an expense by ID associated with the specified business
    const Expense = defineExpenseModel(tenantSequelize);

    const expense = await Expense.findOne({
      where: { id, businessId }, // Filter by both business ID and expense ID
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.status(200).json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update an Expense by ID for a Business
exports.updateExpenseById = async (req, res) => {
  try {
    const { businessId, id } = req.params; // Get the business ID and expense ID from the route parameters
    const { tenantSequelize } = req;

    // logic to update an expense by ID associated with the specified business
    const Expense = defineExpenseModel(tenantSequelize);

    const [updated] = await Expense.update(req.body, {
      where: { id, businessId }, // Filter by both business ID and expense ID
    });

    if (updated) {
      const updatedExpense = await Expense.findOne({
        where: { id, businessId }, // Filter by both business ID and expense ID
      });
      return res.status(200).json(updatedExpense);
    }

    return res.status(404).json({ message: 'Expense not found' });
  } catch (error) {
    console.error('Error updating expense:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete an Expense by ID for a Business
exports.deleteExpenseById = async (req, res) => {
  try {
    const { businessId, id } = req.params; // Get the business ID and expense ID from the route parameters
    const { tenantSequelize } = req;

    // logic to delete an expense by ID associated with the specified business
    const Expense = defineExpenseModel(tenantSequelize);

    const deleted = await Expense.destroy({
      where: { id, businessId },
    });

    if (deleted) {
      return res.status(204).send(); // No content after successful deletion
    }

    return res.status(404).json({ message: 'Expense not found' });
  } catch (error) {
    console.error('Error deleting expense:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
