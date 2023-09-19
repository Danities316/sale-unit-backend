const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expenseController');
const authorizeBusinessAccess = require('../middleware/jwtMiddleware');

// POST /api/expenses/:businessId (Create Expense for a Business)
router.post(
  '/expenses/:businessId',
  authorizeBusinessAccess,
  ExpenseController.createExpense,
);

// GET /api/expenses/:businessId (Get All Expenses for a Business)
router.get(
  '/expenses/:businessId',
  authorizeBusinessAccess,
  ExpenseController.getAllExpenses,
);

// GET /api/expenses/:businessId/:id (Get an Expense by ID for a Business)
router.get(
  '/expenses/:businessId/:id',
  authorizeBusinessAccess,
  ExpenseController.getExpenseById,
);

// PUT /api/expenses/:businessId/:id (Update an Expense by ID for a Business)
router.put(
  '/expenses/:businessId/:id',
  authorizeBusinessAccess,
  ExpenseController.updateExpenseById,
);

// DELETE /api/expenses/:businessId/:id (Delete an Expense by ID for a Business)
router.delete(
  '/expenses/:businessId/:id',
  authorizeBusinessAccess,
  ExpenseController.deleteExpenseById,
);

module.exports = router;
const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/ExpenseController');
const authorizeBusinessAccess = require('./authorizeBusinessAccessMiddleware');

// POST /api/expenses/:businessId (Create Expense for a Business)
router.post(
  '/expenses/:businessId',
  authorizeBusinessAccess,
  ExpenseController.createExpense,
);

// GET /api/expenses/:businessId (Get All Expenses for a Business)
router.get(
  '/expenses/:businessId',
  authorizeBusinessAccess,
  ExpenseController.getAllExpenses,
);

// GET /api/expenses/:businessId/:id (Get an Expense by ID for a Business)
router.get(
  '/expenses/:businessId/:id',
  authorizeBusinessAccess,
  ExpenseController.getExpenseById,
);

// PUT /api/expenses/:businessId/:id (Update an Expense by ID for a Business)
router.put(
  '/expenses/:businessId/:id',
  authorizeBusinessAccess,
  ExpenseController.updateExpenseById,
);

// DELETE /api/expenses/:businessId/:id (Delete an Expense by ID for a Business)
router.delete(
  '/expenses/:businessId/:id',
  authorizeBusinessAccess,
  ExpenseController.deleteExpenseById,
);

module.exports = router;
