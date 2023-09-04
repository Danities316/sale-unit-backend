const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models').User;
const TenantConfig = require('../../models').Tenantconfigs;
const {
  forgetPasswordEmail,
  sendConfirmationEmail,
} = require('../../config/mailTransport'); // For sending email (you may use a different library)
const dotenv = require('dotenv');
const crypto = require('crypto');
const sendVerificationCode = require('../../utils/twilio');

dotenv.config();

// Secret key for JWT token
const JWT_SECRET = process.env.JWT_SECRET;
// Your AccountSID and Auth Token from console.twilio.com

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.registerUser = async (req, res) => {
  try {
    const { password, phone } = req.body;

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
      return res
        .status(400)
        .json({ message: 'Phone number already registered' });
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
        password: hashedPassword,
        phone,
        verificationCode,
      });

      // Generate and send JWT token
      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);
      // Respond with a success message
      return res.status(201).json({ token });
    } catch (twilioError) {
      console.error('Error sending SMS via Twilio:', twilioError);
      return res.status(500).json({ message: 'Error sending SMS via Twilio' });
    }
  } catch (error) {
    console.error('Error during registration:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateUserInfo = async (req, res) => {
  const id = req.user.userId; // comming from the jwt token;
  console.log('this is the user: ', req.user);
  try {
    const { firstName, lastName, username, businessName, CAC, email } =
      req.body;

    // Validate the incoming data
    if (!firstName || !lastName || !username || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findAll({ where: { id } });

    // Check if the user is authenticated
    if (user.isVerified == false) {
      return res.status(401).json({ message: 'user Unauthorized' });
    }

    // Update user information in the User table
    const userId = id; // Assuming you have a user ID in your session
    const updatedUser = await User.update(
      {
        firstName,
        lastName,
        username,
        businessName,
        CAC,
        email,
      },
      { where: { id: userId } },
    );
    await TenantConfig.create({
      databaseName: username + id,
      username: username,
      password: user.password,
      host: 'mysql',
    });

    return res.status(200).json({
      message: 'User information updated and Database created successfully',
    });
  } catch (error) {
    console.error('Error during user information update:', error.message);
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

    // Validate phone number format (You can use a library like 'libphonenumber' for more thorough validation)
    // if (!/^\d{10}$/.test(phone)) {
    //   return res.status(400).json({ message: 'Invalid phone number format' });
    // }

    // Find the user by phone number
    const user = await User.findOne({ where: { phone } });

    if (!user || user.verificationCode !== verificationCode) {
      // Implement rate limiting here to prevent abuse
      return res.status(401).json({ message: 'Invalid verification code' });
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

exports.forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //Change is verified to false
    user.isVerified = false;

    /**********************This line of code is for sending verification via email */
    // Generate a temporary reset code
    // const resetToken = crypto.randomBytes(20).toString('hex');

    // Set the reset token and expiration time in the user's record
    // user.resetToken = resetToken;
    // user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    // Send a password reset email to the user
    // forgetPasswordEmail(req.headers.host, user.name, email, resetToken);

    // Generate a 6-digit verification code
    const verificationCode = generateVerificationCode();

    // Send the verification code via SMS using Twilio
    await sendVerificationCode(phone, verificationCode);
    user.verificationCode = verificationCode;

    // Save the user record
    await user.save();

    //get last 4 digit of users phone numer
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
    return res.status(500).json({
      error: 'An error occurred while resetting the password!',
    });
  }
};
