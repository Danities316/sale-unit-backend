const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticateJWT = require('../middleware/jwtMiddleware');

// Create a new notification
router.post('/', authenticateJWT, notificationController.createNotification);

// Get all notifications
router.get('/', authenticateJWT, notificationController.getAllNotifications);

// Mark a notification as read
router.put(
  '/:id',
  authenticateJWT,
  notificationController.markNotificationAsRead,
);

// Delete a notification
router.delete(
  '/:id',
  authenticateJWT,
  notificationController.deleteNotification,
);

module.exports = router;
