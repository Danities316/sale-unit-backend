const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  forgetPasswordEmail,
  sendConfirmationEmail,
} = require('../../config/mailTransport'); // For sending email (you may use a different library)
// const twilio = require('twilio');
const User = require('../../models').User;
require('dotenv').config();

// Secret key for JWT token
const JWT_SECRET = process.env.JWT_SECRET;
// Your AccountSID and Auth Token from console.twilio.com
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTHTOKEN;

//@desc     create User
//@route    POST /api/auth/register
//@access   Public
exports.registerUser = async (req, res) => {
  try {
    const { name, username, password, email, phone } = req.body;
    if (!check('phone').isMobilePhone(phone, ['en-NG'])) {
      return res.status(400).json('Must provide a valid US phone number.');
    }

    if (!check('password').isLength({ min: 6 })) {
      return res.status(400).json('Password Must be more than 6 characterss .');
    }

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

    // Generate a 6-digi verification codeß
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Send the verification code via SMS using Twilio or another library
    const twilioClient = require('twilio')(accountSid, authToken);

    twilioClient.messages
      .create({
        body: `Your verification code: ${verificationCode}`,
        to: phone,
        from: '+15005550006',
      })
      .then((message) => console.log('Thus twilio', message.sid));

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

    return res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

//@desc     login User
//@route    POST /api/auth/login
//@access   Public
exports.loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find the user by phone number
    const user = await User.findOne({ where: { phone } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

//================= LOG OUT USER ======================
exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });

  return res.json({
    message: 'user logged out',
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
      .json({ message: 'Phone number verified successfully' });
  } catch (error) {
    console.error('Error during phone number verification:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

//@desc     forget password
//@route    POST /api/auth/forgot-password
//@access   Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique reset token (you can use a library like `crypto`)
    const resetToken = generateUniqueToken();

    // Set the reset token and expiration time in the user's record
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    // Save the user record
    await user.save();

    // Send a password reset email to the user
    forgetPasswordEmail(req.headers.host, user.name, email, resetToken);

    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error during password reset request:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    console.log(token);
    const { password } = req.body;

    // Find the user by the reset token and ensure it is not expires
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    // if no user found or token expired
    if (!user) {
      return res.status(400).json({
        error: 'invalid or expired toke',
      });
    }

    // update the users password and clear the reset password token field
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: 'Password reset successfull!',
    });
  } catch (error) {
    console.error('Error resetting password', error);
    res.status(500).json({
      error: 'An error occurred while reseting the password!',
    });
  }
};

const generateUniqueToken = () => {
  // Generate a random number between 0 and 1.
  const randomNumber = Math.random();

  // Scale the random number to have 6 digits.
  const scaledNumber = Math.floor(randomNumber * 1000000);

  // Convert the scaled number to a string and pad it with leading zeros if needed.
  const token = String(scaledNumber).padStart(6, '0');

  return token;
};
