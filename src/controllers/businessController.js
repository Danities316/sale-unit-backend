const { Sequelize } = require('sequelize');
const { Business } = require('../../models');
const defineBusinessModel = require('../../models/business');
defineBusinessModel;

// Define the Business model with attributes and relationships
// const defineBusinessModel = (tenantSequelize) => {
//   return tenantSequelize.define('Business', {
//     BusinessName: Sequelize.STRING,
//     BusinessCategory: Sequelize.STRING,
//     stateOfResidence: Sequelize.STRING,
//     YearFounded: Sequelize.DATE,
//     BusinessDescription: Sequelize.TEXT,
//     userId: Sequelize.INTEGER,
//     BusinessLogo: Sequelize.STRING,
//     RegNo: Sequelize.BOOLEAN,
//   });
// };

exports.createBusiness = async (req, res) => {
  const { tenantSequelize } = req; // Get the tenant-specific Sequelize instance
  // console.log("show DB: ",  tenantSequelize)
  // console.log('Inside route handler. tenantSequelize:', tenantSequelize);

  try {
    // Define the Business model for the current tenant
    const BusinessModel = defineBusinessModel(tenantSequelize);

    // Synchronize the Business model with the tenant-specific database
    await BusinessModel.sync();

    const newBusiness = await Business.create(req.body);
    // console.log("the body and the Business: " + newBusiness.BusinessName)
    res.status(201).json(newBusiness);
  } catch (error) {
    console.error('There is an error creating bussiness ', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all businesses
exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.findAll();
    res.status(200).json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a business by ID
exports.getBusinessById = async (req, res) => {
  const { id } = req.params;
  try {
    const business = await Business.findByPk(id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.status(200).json(business);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a business by ID
exports.updateBusinessById = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Business.update(req.body, {
      where: { BusinessID: id },
    });
    if (updated) {
      const updatedBusiness = await Business.findByPk(id);
      return res.status(200).json(updatedBusiness);
    }
    return res.status(404).json({ message: 'Business not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a business by ID
exports.deleteBusinessById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Business.destroy({
      where: { BusinessID: id },
    });
    if (deleted) {
      return res.status(204).send();
    }
    return res.status(404).json({ message: 'Business not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
