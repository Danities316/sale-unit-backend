<<<<<<< HEAD
const { Business } = require('../../models');

exports.createBusiness = async (req, res) => {
  const id = req.user;
  console.log("show id: ", id)

  try {
    const business = await Business.create(req.body);
    res.status(201).json(business);
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
=======
const { body, validationResult } = require('express-validator');

module.exports = {
  validateRegistrationData: [
    body('name').notEmpty(),
    body('username').notEmpty(),
    body('password').isLength({ min: 6 }),
    body('email').isEmail(),
    body('phone').isMobilePhone(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],

  // Define other user-related controllers here
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
};
