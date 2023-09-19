const defineNotificationModel = require('../../models/notificationModel');

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { notificationType, message, timestamp, isRead, date } = req.body;
    const { businessId, TenantID } = req.user; // Assuming you have user context
    const { tenantSequelize } = req;

    // Define the Business model for the current tenant
    const Notification = defineNotificationModel(tenantSequelize);
    const notification = await Notification.create({
      notificationType,
      Message: message,
      timestamp,
      isRead,
      Date: date,
      businessId,
      TenantID,
    });

    return res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all notifications for a specific user or business
exports.getAllNotifications = async (req, res) => {
  try {
    const { businessId, TenantID } = req.user; // Assuming you have user context
    const { tenantSequelize } = req;

    // Define the Business model for the current tenant
    const Notification = defineNotificationModel(tenantSequelize);
    const notifications = await Notification.findAll({
      where: { businessId, TenantID },
    });

    return res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessId, TenantID } = req.user; // Assuming you have user context
    const { tenantSequelize } = req;

    // Define the Business model for the current tenant
    const Notification = defineNotificationModel(tenantSequelize);
    const notification = await Notification.findOne({
      where: { id, businessId, TenantID },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessId, TenantID } = req.user; // Assuming you have user context
    const { tenantSequelize } = req;

    // Define the Business model for the current tenant
    const Notification = defineNotificationModel(tenantSequelize);
    const notification = await Notification.findOne({
      where: { id, businessId, TenantID },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.destroy();

    return res.status(204).json();
  } catch (error) {
    console.error('Error deleting notification:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
