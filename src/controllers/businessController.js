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
};
