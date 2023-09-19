const cloudinary = require('../../config/cloudinary');
const definePurchaseModel = require('../../models/purchaseModel');
const defineProductModel = require('../../models/productModel');
const defineNotificationModel = require('../../models/notificationModel');

// Create a Purchase
exports.createPurchase = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { tenantSequelize } = req;

    // logic to create a purchase associated with the specified business
    const {
      productName,
      paidBy,
      description,
      unit,
      purchaseImage,
      purchaseDate,
      amount,
      costPrice,
      sellingPrice,
      quantity,
    } = req.body;

    const Purchase = definePurchaseModel(tenantSequelize);
    const Product = defineProductModel(tenantSequelize);

    const purchase = await Purchase.create({
      productName,
      paidBy,
      description,
      unit,
      purchaseImage,
      purchaseDate,
      amount,
      costPrice,
      sellingPrice,
      quantity,
      businessId, // Associate the purchase with the specified business
    });

    // Update the product's quantity on hand
    const product = await Product.findOne({ where: { productName } });
    if (product) {
      product.quantityOnHand += quantity;
      await product.save();

      // Check if the quantity on hand is below the reorder threshold
      if (product.quantityOnHand < product.reorderThreshold) {
        // Trigger a stock alert here (send a notification)
        await sendStockAlert(product.productName, businessId, tenantSequelize);
      }
    }

    return res.status(201).json(purchase);
  } catch (error) {
    console.error('Error creating purchase:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get All Purchases for a Business
exports.getAllPurchases = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { tenantSequelize } = req;

    // logic to fetch all purchases associated with the specified business

    const Purchase = definePurchaseModel(tenantSequelize);

    const purchases = await Purchase.findAll({
      where: { businessId },
    });

    return res.status(200).json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a Purchase by ID for a Business
exports.getPurchaseById = async (req, res) => {
  try {
    const { businessId, id } = req.params;
    const { tenantSequelize } = req;

    //logic to fetch a purchase by ID associated with the specified business
    const Purchase = definePurchaseModel(tenantSequelize);

    const purchase = await Purchase.findOne({
      where: { id, businessId },
    });

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    return res.status(200).json(purchase);
  } catch (error) {
    console.error('Error fetching purchase:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a Purchase by ID for a Business
exports.updatePurchaseById = async (req, res) => {
  try {
    const { businessId, id } = req.params;
    const { tenantSequelize } = req;

    // logic to update a purchase by ID associated with the specified business
    const Purchase = definePurchaseModel(tenantSequelize);

    const [updated] = await Purchase.update(req.body, {
      where: { id, businessId },
    });

    if (updated) {
      const updatedPurchase = await Purchase.findOne({
        where: { id, businessId },
      });
      return res.status(200).json(updatedPurchase);
    }

    return res.status(404).json({ message: 'Purchase not found' });
  } catch (error) {
    console.error('Error updating purchase:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a Purchase by ID for a Business
exports.deletePurchaseById = async (req, res) => {
  try {
    const { businessId, id } = req.params;
    const { tenantSequelize } = req;

    // logic to delete a purchase by ID associated with the specified business
    const Purchase = definePurchaseModel(tenantSequelize);

    const deleted = await Purchase.destroy({
      where: { id, businessId },
    });

    if (deleted) {
      return res.status(204).send();
    }

    return res.status(404).json({ message: 'Purchase not found' });
  } catch (error) {
    console.error('Error deleting purchase:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to send a stock alert notification
const sendStockAlert = async (productName, businessId, sequelize) => {
  try {
    const Notification = defineNotificationModel(sequelize);
    // Create a new notification in the database
    const notification = await Notification.create({
      notificationType: 'Stock Alert',
      Message: `Low stock alert for ${productName}`,
      timestamp: new Date(),
      isRead: false,
      businessId,
    });
    // Here we can implement the logic to send the notification.
    // we might send an email, SMS, or push notification to the business owner.

    // For sending an email:
    // const transporter = nodemailer.createTransport({ ... });
    // const mailOptions = {
    //   to: businessOwnerEmail,
    //   subject: 'Stock Alert',
    //   text: `Low stock alert for ${productName}`,
    // };
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error('Error sending email:', error);
    //   } else {
    //     console.log('Email sent:', info.response);
    //   }
    // });

    // Mark the notification as sent (optional)
    await notification.update({ isSent: true });

    console.log(`Stock alert sent for ${productName}`);
  } catch (error) {
    console.error('Error sending stock alert:', error);
  }
};
