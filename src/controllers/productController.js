const cloudinary = require('../../config/cloudinary');
const defineProductModel = require('../../models/productModel');
const defineNotificationModel = require('../../models/notificationModel');
// const Business =  require('../../models/businessModel');

// Create an product Item
exports.createProductItem = async (req, res) => {
  const { tenantSequelize } = req; // Get the tenant-specific Sequelize instance
  const { businessId } = req.params;
  try {
    // Extract necessary data from req.body
    const {
      productName,
      costPrice,
      sellingPrice,
      unit,
      description,
      label,
      reorderThreshold,
      reorderQuantity,
      quantityOnHand,
    } = req.body;

    // upload image from the request body
    const productImageUrl = await cloudinary.uploader.upload(req.file.path);

    const Product = defineProductModel(tenantSequelize);

    // Create a new product item record in the database
    const productItem = await Product.create({
      productName,
      costPrice,
      sellingPrice,
      unit,
      description,
      label,
      reorderThreshold,
      reorderQuantity,
      quantityOnHand,
      productImage: productImageUrl.secure_url,
      businessId,
    });

    // Check if the quantity on hand is below the reorder threshold
    if (quantityOnHand < reorderThreshold) {
      // Send a reorder notification instead for reordering
      await sendReorderNotification(
        productName,
        businessId,
        tenantSequelize,
        tenantId,
      );
      // You can customize the sendReorderNotification function to send notifications

      // Update the quantity on hand accordingly
      quantityOnHand += reorderQuantity;
    }

    return res.status(201).json(productItem);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating product item.' });
  }
};

// Retrieve product for a Tenant
exports.retrieveProductItems = async (req, res) => {
  const { tenantSequelize } = req; // Get the tenant-specific Sequelize instance

  try {
    const { businessId } = req.user;

    const Product = defineProductModel(tenantSequelize);
    // Fetch product items based on tenantId and businessId
    const productItems = await Product.findAll({
      where: { businessId },
    });

    return res.json(productItems);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving product items.' });
  }
};

// Update product Item
exports.updateProductItem = async (req, res) => {
  const { tenantSequelize } = req; // Get the tenant-specific Sequelize instance
  try {
    const { id } = req.params;
    const {
      productName,
      costPrice,
      sellingPrice,
      unit,
      description,
      label,
      reorderThreshold,
      reorderQuantity,
      quantityOnHand,
    } = req.body;
    const { businessId } = req.user;

    // upload image from the request body
    const productImageUrl = await cloudinary.uploader.upload(req.file.path);

    const Product = defineProductModel(tenantSequelize);
    // Update the product item record in the database
    const [updatedRows] = await Product.update(
      {
        productName,
        costPrice,
        sellingPrice,
        unit,
        description,
        label,
        reorderThreshold,
        reorderQuantity,
        quantityOnHand,
        productImage: productImageUrl.secure_url,
        businessId,
      },
      { where: { id, businessId } },
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ error: 'product item not found or unauthorized.' });
    }

    const updatedProductItem = await Product.findByPk(id);
    return res.json(updatedProductItem);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating product item.' });
  }
};

// Delete product Item
exports.deleteProductItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessId } = req.user;

    // Delete the product item record from the database
    const deletedRowCount = await Product.destroy({
      where: { id, businessId },
    });

    if (deletedRowCount === 0) {
      return res
        .status(404)
        .json({ error: 'product item not found or unauthorized.' });
    }

    return res.json({ message: 'product item deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting product item.' });
  }
};

// Function to send a reorder notification (simplified example)
async function sendReorderNotification(
  productName,
  businessId,
  tenantSequelize,
  TenantID,
) {
  try {
    const Notification = defineNotificationModel(tenantSequelize);
    // Create a notification record in the database
    await Notification.create({
      notificationType: 'Reorder',
      Message: `Product "${productName}" needs to be reordered for business ${businessId}`,
      timestamp: new Date(),
      isRead: false,
      Date: new Date(),
      businessId,
      TenantID,
    });

    // You can also implement additional logic, such as sending notifications to administrators or a notification service
  } catch (error) {
    console.error('Error sending reorder notification:', error);
    // Handle error, perhaps by logging it or sending it to an error tracking service
  }
}
