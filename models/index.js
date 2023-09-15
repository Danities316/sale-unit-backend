// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

// models/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { masterSequelize } = require('../config/database');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = {};
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });
//this users models come from the main database i.e bookkeeping_db
const usersModel = require('./user');

const customerModel = require('./customerModel');
const saleModel = require('./saleModel');
const debtModel = require('./debtModel');
const expenseModel = require('./expenseModel');
const purchaseModel = require('./purchaseModel');
const productModel = require('./productModel');
const notificationModel = require('./notificationModel');
const staffModel = require('./staffModel');
const businessModel = require('./businessModel');
// this user model comed from tenant's specific database
const userModel = require('./userModel');

// const Users = usersModel(sequelize, masterSequelize);
const Business = businessModel(sequelize, Sequelize);
const Customer = customerModel(sequelize, Sequelize);

const Sale = saleModel(sequelize, Sequelize);

const Debt = debtModel(sequelize, Sequelize);

const Product = productModel(sequelize, Sequelize);

const Purchase = purchaseModel(sequelize, Sequelize);

const Notification = notificationModel(sequelize, Sequelize);

const Expense = expenseModel(sequelize, Sequelize);

const TenantUser = userModel(sequelize, Sequelize);

const Staff = staffModel(sequelize, Sequelize);

// Users.hasMany(Business, {
//   foreignKey: 'TenantID',
//   targetKey: 'id',
//   as: 'tenant',
// });

Business.belongsTo(TenantUser, {
  foreignKey: 'TenantID',
  targetKey: 'id',
  as: 'tenant',
});

Business.hasMany(Customer, { foreignKey: 'businessId', as: 'customers' });
Business.hasMany(Sale, { foreignKey: 'businessId', as: 'sales' });
Business.hasMany(Debt, { foreignKey: 'businessId', as: 'debt' });
Business.hasMany(Expense, { foreignKey: 'businessId', as: 'expense' });
Business.hasMany(Purchase, { foreignKey: 'businessId', as: 'purchase' });
Business.hasMany(Product, { foreignKey: 'businessId', as: 'productSales' });
Business.hasMany(Notification, {
  foreignKey: 'businessId',
  as: 'businessNotification',
});
Business.hasMany(Staff, { foreignKey: 'businessId', as: 'businessStaff' });

Debt.belongsTo(Customer, {
  foreignKey: 'customerId',
  targetKey: 'id',
  as: 'customerDebts',
});
Debt.belongsTo(Business, {
  foreignKey: 'businessId',
  targetKey: 'id',
  as: 'debt',
});

Customer.belongsTo(Business, {
  foreignKey: 'businessId',
  targetKey: 'id',
  as: 'customerforBusiness',
});

Notification.belongsTo(TenantUser, { foreignKey: 'TenantID', targetKey: 'id' });
Notification.belongsTo(Business, {
  foreignKey: 'businessId',
  targetKey: 'id',
  as: 'notification',
});

Expense.belongsTo(Business, {
  foreignKey: 'businessId',
  targetKey: 'id',
  as: 'expense',
});

Product.belongsTo(Business, {
  foreignKey: 'businessId',
  targetKey: 'id',
  as: 'productForBusiness',
});

Purchase.belongsTo(Business, {
  foreignKey: 'businessId',
  targetKey: 'id',
  as: 'purchasesForBusiness',
});
Purchase.belongsTo(Product, {
  foreignKey: 'productId',
  targetKey: 'id',
  as: 'purchaseProduct',
});

Sale.belongsTo(Business, {
  foreignKey: 'businessId',
  targetKey: 'id',
  as: 'salesForBusiness',
});
Sale.belongsTo(Product, {
  foreignKey: 'productId',
  targetKey: 'id',
  as: 'productSales',
});

Staff.belongsTo(Business, {
  foreignKey: 'businessId',
  targetKey: 'id',
  as: 'staff',
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach models to the db object

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Define associations here

module.exports = db;
