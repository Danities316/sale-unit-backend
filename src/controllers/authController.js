const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User } = require('../../models');
const defineUserModel = require('../../models/userModel');
// const { TenantUser } = require('../../models');
// const TenantUser = userModel(sequelize, Sequelize);
const {
  forgetPasswordEmail,
  sendConfirmationEmail,
} = require('../../config/mailTransport'); // For sending email (you may use a different library)
const sendVerificationCode = require('../../utils/twilio');
const dotenv = require('dotenv');
const {
  createTenantDatabase,
  switchTenant,
} = require('../../src/middleware/tenantMiddleware');
const { TenantConfig } = require('../../models');
const { urlencoded } = require('body-parser');
// const { Business } = require('../../models');
// const defineBusinessModel = require('../../models/businessModel');

dotenv.config();

// Secret key for JWT token
const JWT_SECRET = process.env.JWT_SECRET;

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { password, phone } = req.body;

    // Validate phone number and password
    if (!check('phone').isMobilePhone(phone, ['en-NG'])) {
      return res.status(400).json('Must provide a valid US phone number.');
    }

    if (!check('password').isLength({ min: 6 })) {
      return res.status(400).json('Password must be more than 6 characters.');
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the phone number is already registered
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Phone number already registered' });
    }

    // Generate a 6-digit verification code
    const verificationCode = generateVerificationCode();
    console.log('verificationCode: ', verificationCode);

    // Send the verification code via SMS using Twilio
    // try {
    //   await sendVerificationCode(phone, verificationCode);
    // } catch (twilioError) {
    //   console.error('Error sending SMS via Twilio:', twilioError.stack);
    //   return res.status(500).json({ message: 'Error sending SMS via Twilio' });
    // }

    // Hash the password before storing it
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user record with verification code and password
    const newUser = await User.create({
      password: hashedPassword,
      phone,
      verificationCode,
    });

    // Generate and send JWT token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);

    // Respond with a success message
    return res.status(201).json({ token });
  } catch (error) {
    console.error('Error during registration:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.verifyPhoneNumber = async (req, res) => {
  try {
    const { phone, verificationCode } = req.body;

    // Find the user by phone number
    const user = await User.findOne({ where: { phone } });

    if (
      !user ||
      user.verificationCode !== verificationCode ||
      user.phone !== phone
    ) {
      // Implement rate limiting here to prevent abuse
      return res
        .status(401)
        .json({ message: 'Invalid verification code or phone number' });
    }

    // Mark the user as verified in the database
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    // Log the successful verification
    console.log(`Phone number ${phone} verified successfully`);

    return res
      .status(200)
      .json({ message: 'Phone number verified successfully' });
  } catch (error) {
    console.error('Error during phone number verification:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find the user by phone number
    const user = await User.findOne({ where: { phone } });

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Generate and send JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update user information
exports.updateUserInfo = async (req, res) => {
  const userId = req.user.userId; // Coming from the jwt token;
  console.log('userId: ', userId);

  if (userId === null) {
    console.log('No user found');
    return res.status(404).json({
      msg: 'No User Found!',
    });
  }

  try {
    const {
      firstName,
      lastName,
      // businessName,
      // businessCategory,
      // businessDescription,
      // businessLogo,
      // stateOfResidence,
      // yearFounded,
      // City,
      // RegNo,
      email,
    } = req.body;

    // Validate the incoming data
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findOne({ where: { id: userId } });

    // Check if the user is authenticated
    if (!user.isVerified) {
      return res.status(401).json({ message: 'User Unauthorized' });
    }

    // Update user information in the User table
    // Generate password to be used in the database
    const password = crypto.randomBytes(4).toString('hex');

    await User.update(
      {
        firstName,
        lastName,
        email,
      },
      { where: { id: userId } },
    );

    // Insert tenant configuration into the central database (bookkeeping_db.TenantConfigs)
    await TenantConfig.create({
      databaseName: firstName + lastName + userId + '_db',
      username: firstName + lastName,
      password: password,
      host: process.env.HOST,
      dialect: 'mysql',
      userId: userId,
    });

    // Create a tenant database
    const tenantSequelize = await createTenantDatabase(
      firstName + lastName + userId,
      firstName + lastName,
      password,
    );
    // try {
    //   await createTenantDatabase(
    //     firstName + lastName + userId,
    //     firstName + lastName,
    //     password,
    //   );
    // } catch (dbError) {
    //   console.error('Error creating tenant database:', dbError.message);
    //   return res
    //     .status(500)
    //     .json({ message: 'Failed to create tenant database' });
    // }

    // console.log('Ther is the sequelize: ', createTenantDatabase);

    // Define the Business model for the current tenant

    // console.log('THis is the business part: ', Business);

    // Create a new business record

    // const Business = defineBusinessModel(tenantSequelize);
    // const TenantUser = defineUserModel(tenantSequelize);
    await tenantSequelize.sync();

    // await Business.create({
    //   businessName,
    //   businessCategory,
    //   businessDescription,
    //   businessLogo,
    //   stateOfResidence,
    //   yearFounded,
    //   RegNo,
    //   City,
    //   email,
    //   TenantID: userId,
    // });

    return res.status(200).json({
      message: `User information updated, and Database for  ${
        firstName + lastName + userId
      } created successfully`,
    });
  } catch (error) {
    console.error('Error during user information update:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Forgot password: Generate and send a reset code
exports.forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;

    // Find the user by phone number
    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 6-digit verification code
    const verificationCode = generateVerificationCode();

    // Send the verification code via SMS using Twilio
    await sendVerificationCode(phone, verificationCode);
    user.verificationCode = verificationCode;

    // Save the user record
    await user.save();

    // Get the last 4 digits of the user's phone number
    const getLast4Digits = (phoneNumber) => phoneNumber.slice(-4);

    return res.status(200).json({
      message: `Password reset has been sent to ******${getLast4Digits(
        phone,
      )} phone number`,
    });
  } catch (error) {
    console.error('Error during password reset request:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Reset password using the provided token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find the user by the reset token and ensure it is not expired
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          $gt: Date.now(),
        },
      },
    });

    // If no user found or token expired
    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired token',
      });
    }

    // Update the user's password and clear the reset password token field
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: 'Password reset successful!',
    });
  } catch (error) {
    console.error('Error resetting password', error);
    return res.status(500).json({
      error: 'An error occurred while resetting the password!',
    });
  }
};

exports.test = (req, res) => {
  const user = req.user;
  console.log('you are in your database now', user);
  res.json({
    msg: 'You are in your database now',
  });
};
