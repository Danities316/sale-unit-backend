const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models').User;
const { forgetPasswordEmail, sendConfirmationEmail } = require('../../config/mailTransport'); // For sending email (you may use a different library)
const dotenv = require('dotenv');
const sendVerificationCode = require("../../utils/twilio")

dotenv.config();

// Secret key for JWT token
const JWT_SECRET = process.env.JWT_SECRET;
// Your AccountSID and Auth Token from console.twilio.com


const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.registerUser = async (req, res) => {
  try {
    const { name, username, password, email, phone } = req.body;

    // Validate phone number
    if (!check('phone').isMobilePhone(phone, ['en-NG'])) {
      return res.status(400).json('Must provide a valid US phone number.');
    }

    // Validate password
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
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Generate a 6-digit verification code
    const verificationCode = generateVerificationCode();

    try {
      // Send the verification code via SMS using Twilio
      await sendVerificationCode(phone, verificationCode);

      // Hash the password before storing it
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Create a new user record with verification code
      const newUser = await User.create({
        name,
        username,
        password: hashedPassword,
        email,
        phone,
        verificationCode,
      });

      // Respond with a success message
      return res.status(201).json({ message: 'Registration successful' });
    } catch (twilioError) {
      console.error('Error sending SMS via Twilio:', twilioError);
      return res.status(500).json({ message: 'Error sending SMS via Twilio' });
    }
  } catch (error) {
    console.error('Error during registration:', error.message);
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

    if (!user || !passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Store user information in the session to authenticate
    req.session.user = user;
    return res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });

  return res.json({
    message: 'User logged out',
  });
};

exports.verifyPhoneNumber = async (req, res) => {
  try {
    const { phone, verificationCode } = req.body;

    // Find the user by phone number
    const user = await User.findOne({ where: { phone } });

    if (!user || user.verificationCode !== verificationCode) {
      return res.status(401).json({ message: 'Invalid verification code' });
    }

    // Mark the user as verified in the database
    user.isVerified = true;
    await user.save();

    return res
      .status(200)
      .json({ message: 'Phone number verified successfully', user });
  } catch (error) {
    console.error('Error during phone number verification:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a temporary reset code (customize this as needed)
    const resetToken = generateVerificationCode();

    // Set the reset token and expiration time in the user's record
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    // Store the reset code in the session
    req.session.resetCode = resetToken;
    req.session.user = user;

    // Save the user record
    await user.save();

    // Send a password reset email to the user
    forgetPasswordEmail(req.headers.host, user.name, email, resetToken);

    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error during password reset request:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

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

    // if no user found or token expired
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
    res.status(500).json({
      error: 'An error occurred while resetting the password!',
    });
  }
};
