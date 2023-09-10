const { Sequelize } = require('sequelize');
const { Business } = require('../../models');
const defineBusinessModel =  require('../../models/businessModel');
// const Business =  require('../../models/businessModel');


exports.createBusiness = async (req, res) => {
  const { tenantSequelize } = req; // Get the tenant-specific Sequelize instance
  const { userId } = req.user.userId;
  // console.log("show DB: ",  req)

  try {
    const existingBusinessCount = await BusinessModel.count({
      where: {
        userId: userId,
      },
    });

    if (existingBusinessCount >= 3) {
      return res.status(400).json({
        message: 'You have reached the maximum limit of 3 businesses per user.',
      });
    }
    
    const {BusinessName,
      BusinessCategory,
      stateOfResidence,
      YearFounded,
      BusinessDescription,
      BusinessLogo,
      RegNo,
      } = req.body 
    // Define the Business model for the current tenant
    const BusinessModel = defineBusinessModel(tenantSequelize);

    // Synchronize the Business model with the tenant-specific database
    // await BusinessModel.sync();

    // const newBusiness = await BusinessModel.create();
    const newBusiness = await BusinessModel.create({
      BusinessName,
      BusinessCategory,
      stateOfResidence,
      YearFounded,
      BusinessDescription,
      userId: userId,
      BusinessLogo,
      RegNo,

  });
    // console.log("the body and the Business: " + newBusiness.BusinessName)
    res.status(201).json(newBusiness);
  } catch (error) {
    console.error('There is an error creating bussiness ', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all businesses
exports.getAllBusinesses = async (req, res) => {
  const { tenantSequelize } = req; // Get the tenant-specific Sequelize instance

  const BusinessModel = defineBusinessModel(tenantSequelize);
  try {
    const businesses = await BusinessModel.findAll();
    res.status(200).json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a business by ID
exports.getBusinessById = async (req, res) => {
  const { id } = req.params;
  const { tenantSequelize } = req; // Get the tenant-specific Sequelize instance

  const BusinessModel = defineBusinessModel(tenantSequelize);
  try {
    const business = await BusinessModel.findByPk(id);
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
  const { tenantSequelize } = req; // Get the tenant-specific Sequelize instance

  const BusinessModel = defineBusinessModel(tenantSequelize);
  try {
    const [updated] = await BusinessModel.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedBusiness = await BusinessModel.findByPk(id);
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
  const { tenantSequelize } = req; // Get the tenant-specific Sequelize instance

  const BusinessModel = defineBusinessModel(tenantSequelize);
  try {
    const deleted = await BusinessModel.destroy({
      where: { id },
    });
    if (deleted) {
      return res.status(204).send("Business has been deleted successfully");
    }
    return res.status(404).json({ message: 'Business not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
