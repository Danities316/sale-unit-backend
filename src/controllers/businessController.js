const { Sequelize } = require('sequelize');
const cloudinary = require('../../config/cloudinary');
const defineBusinessModel = require('../../models/businessModel');
// const Business =  require('../../models/businessModel');

// Secret key for JWT token
const JWT_SECRET = process.env.JWT_SECRET;

exports.createBusiness = async (req, res) => {
  const { tenantSequelize } = req; // Get the tenant-specific Sequelize instance
  const userId = req.user.userId;
  // console.log('show DB: ', userId);

  try {
    const {
      businessName,
      businessCategory,
      stateOfResidence,
      yearFounded,
      businessDescription,
      // businessLogo,
      RegNo,
    } = req.body;

    const logoUrl = await cloudinary.uploader.upload(req.file.path);
    // console.log('This is the URL: ', logoUrl);

    // Define the Business model for the current tenant
    const BusinessModel = defineBusinessModel(tenantSequelize);

    const existingBusinessCount = await BusinessModel.count({
      where: {
        TenantID: userId,
      },
    });

    if (existingBusinessCount >= 3) {
      return res.status(400).json({
        message: 'You have reached the maximum limit of 3 businesses per user.',
      });
    }

    // const newBusiness = await BusinessModel.create();
    const newBusiness = await BusinessModel.create({
      businessName,
      businessCategory,
      stateOfResidence,
      yearFounded,
      businessDescription,
      TenantID: userId,
      businessLogo: logoUrl.secure_url,
      RegNo,
    });

    // Fetch and include the user's associated businessIds here
    const userBusinesses = await BusinessModel.findAll({
      where: { TenantID: userId },
      attributes: ['id'],
    });

    const existingBusinessIds = userBusinesses.map((business) => business.id);

    // Add the new businessId to the existing list
    existingBusinessIds.push(newBusiness.id);

    // Generate a new JWT token with the updated businessIds
    const tokenPayload = {
      userId: userId,
      businessIds: existingBusinessIds,
    };

    const updatedToken = jwt.sign(tokenPayload, JWT_SECRET);
    // console.log("the body and the Business: " + newBusiness.BusinessName)
    res.status(201).json({ newBusiness, token: updatedToken });
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
  const {
    businessName,
    businessCategory,
    stateOfResidence,
    yearFounded,
    businessDescription,
    // businessLogo,
    RegNo,
  } = req.body;

  // Check if a file is included in the request (e.g., businessLogo)

  const logoUrl = await uploadToCloudinary(req.file.path);

  const BusinessModel = defineBusinessModel(tenantSequelize);
  try {
    const [updated] = await BusinessModel.update(
      {
        businessName,
        businessCategory,
        stateOfResidence,
        yearFounded,
        businessDescription,
        businessLogo: logoUrl.secure_url,
        RegNo,
      },
      {
        where: { id },
      },
    );
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
      return res.status(204).send('Business has been deleted successfully');
    }
    return res.status(404).json({ message: 'Business not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
