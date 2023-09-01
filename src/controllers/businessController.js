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
};
