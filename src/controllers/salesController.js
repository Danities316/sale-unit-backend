const { Sequelize } = require('sequelize');
const defineSalesModel = require('../../models/saleModel');
const defineBusinessModel = require('../../models/businessModel');

exports.createSaleBusiness = async (req, res) => {
  const { tenantSequelize } = req; // Get the tenant-specific Sequelize instance
  const userId = req.user.userId;
  const { businessId } = req.params;
  try {
    const {
      paymentMethod,
      invoiceNumber,
      saleDate,
      description,
      amount,
      unitPrice,
      totalPrice,
      quantity,
      debt,
      productId,
    } = req.body;

    // Define the Sales model for the current tenant
    const SalesModel = defineSalesModel(tenantSequelize);

    // Create a new Sale record
    const newSale = await SalesModel.create({
      paymentMethod,
      invoiceNumber,
      saleDate,
      description,
      amount,
      unitPrice,
      totalPrice,
      quantity,
      debt,
      productId,
      bussinessId,
    });

    res.status(201).json(newSale);
  } catch (error) {
    console.error('Error creating Sale:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getSalesForBusiness = async (req, res) => {
  try {
    const { tenantSequelize } = req; // Get the tenant-specific Sequelize instance
    const SalesModel = defineSalesModel(tenantSequelize);
    const BusinessModel = defineBusinessModel(tenantSequelize);
    const { userId } = req.user.userId; // Assuming I have user information in the request
    const { businessId } = req.params; // Extract the business ID from the request parameters(i would revisit this)

    // Check if the user owns the specified business
    const userOwnsBusiness = await BusinessModel.findOne({
      where: {
        userId,
        id,
      },
    });

    if (!userOwnsBusiness) {
      return res.status(403).json({
        message: 'You do not have permission to view sales for this business.',
      });
    }

    // Fetch sales for the specified user and business
    const sales = await SalesModel.findAll({
      where: {
        userId,
        businessId,
      },
    });

    res.status(200).json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const { tenantSequelize } = req;
    const SalesModel = defineSalesModel(tenantSequelize);
    const BusinessModel = defineBusinessModel(tenantSequelize);
    const { userId } = req.user.userId; // Assuming you have user information in the request
    const { id } = req.params; // Extract the sale ID from the request parameters

    // Fetch the sale by ID
    const sale = await SalesModel.findOne({
      where: {
        userId,
        id,
      },
    });

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found.' });
    }

    // Check if the user owns the business associated with the sale
    const userOwnsBusiness = await BusinessModel.findOne({
      where: {
        userId,
        id: sale.businessId,
      },
    });

    if (!userOwnsBusiness) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to view this sale.' });
    }

    res.status(200).json(sale);
  } catch (error) {
    console.error('Error fetching sale by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateSale = async (req, res) => {
  try {
    const { tenantSequelize } = req;
    const SalesModel = defineSalesModel(tenantSequelize);
    const BusinessModel = defineBusinessModel(tenantSequelize);
    const { userId } = req.user.userId;
    const { id } = req.params;

    // Fetch the sale by ID
    const sale = await SalesModel.findOne({
      where: {
        userId,
        id,
      },
    });

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found.' });
    }

    // Check if the user owns the business associated with the sale
    const userOwnsBusiness = await BusinessModel.findOne({
      where: {
        userId,
        id: sale.businessId,
      },
    });

    if (!userOwnsBusiness) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to update this sale.' });
    }

    // Update the sale with new data
    const updatedSale = await sale.update(req.body);

    res.status(200).json(updatedSale);
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const { tenantSequelize } = req;
    const SalesModel = defineSalesModel(tenantSequelize);
    const BusinessModel = defineBusinessModel(tenantSequelize);
    const { userId } = req.user.userId;
    const { id } = req.params;

    // Fetch the sale by ID
    const sale = await SalesModel.findOne({
      where: {
        userId,
        id,
      },
    });

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found.' });
    }

    // Check if the user owns the business associated with the sale
    const userOwnsBusiness = await BusinessModel.findOne({
      where: {
        userId,
        id: sale.businessId,
      },
    });

    if (!userOwnsBusiness) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to delete this sale.' });
    }

    // Delete the sale
    await sale.destroy();

    res.status(204).send({ msg: 'Sales deleted successfully' }); // Respond with a 204 No Content status
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
