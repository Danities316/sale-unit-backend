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
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];



const db = {};
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

const customerModel = require('./customerModel'); 
const saleModel = require('./saleModel'); 
const debtModel =require('./debtModel'); 
const expenseModel = require('./expenseModel'); 
const purchaseModel = require('./purchaseModel'); 
const productModel = require('./productModel'); 
const notificationModel = require('./notificationModel'); 
const staffModel =require('./staffModel'); 
const businessModel =  require("./businessModel");
const userModel = require('./userModel');

const Business = businessModel(sequelize, Sequelize);
const Customer = customerModel(sequelize, Sequelize);

const Sale = saleModel(sequelize, Sequelize);

const Debt = debtModel(sequelize, Sequelize);

const Product = productModel(sequelize, Sequelize);

const Purchase = purchaseModel(sequelize, Sequelize);

const Notification = notificationModel(sequelize, Sequelize);

const Expense = expenseModel(sequelize, Sequelize);

const User = userModel(sequelize, Sequelize);

const Staff = staffModel(sequelize, Sequelize);


Business.hasMany(Customer, { foreignKey: 'BusinessId' });
Business.hasMany(Sale, { foreignKey: 'BusinessId' });
Business.hasMany(Debt, { foreignKey: 'BusinessId' });
Business.hasMany(Expense, { foreignKey: 'BusinessId' });
Business.hasMany(Purchase, { foreignKey: 'BusinessId' });
Business.hasMany(Product, { foreignKey: 'BusinessId' });
Business.hasMany(Notification, { foreignKey: 'BusinessId' });
Business.hasMany(Staff, { foreignKey: 'BusinessId' });

Debt.belongsTo(Customer, { foreignKey: 'id' });
Debt.belongsTo(Business, { foreignKey: 'id' });

Customer.belongsTo(Business, { foreignKey: 'id' });

Notification.belongsTo(User, { foreignKey: 'id' });
Notification.belongsTo(Business, { foreignKey: 'id' });

Expense.belongsTo(Business, { foreignKey: 'id' });

Product.belongsTo(Business, { foreignKey: 'id' });

Purchase.belongsTo(Business, { foreignKey: 'id' });
Purchase.belongsTo(Product, { foreignKey: 'id' });

Sale.belongsTo(Business, { foreignKey: 'id' });
Sale.belongsTo(Product, { foreignKey: 'id' });
Sale.belongsTo(User, { foreignKey: 'id' });

Staff.belongsTo(Business, { foreignKey: 'id' });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach models to the db object

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Define associations here

module.exports = db;

