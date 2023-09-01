const nodemailer = require('nodemailer');

const user = process.env.EMAIL_ADDRESS;
const pass = process.env.EMAIL_PASSWORD;

const mailTransport = nodemailer.createTransport({
  service: 'Gmail',
  port: 465,
  secure: true,
  host: 'smtp.gmail.com',
  auth: {
    user: user,
    pass: pass,
  },
});

const sendConfirmationEmail = async (
  header,
  firstName,
  email,
  confirmationCode,
  userID,
) => {
  try {
    const mailing = await mailTransport.sendMail({
      from: user,
      to: email,
      subject: 'Please Confirm your account',
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${firstName},</h2>
        <p>Thank you for signing up. Please confirm your email using this ${confirmationCode}</p>
        <a href="http://${header}/api/user/confirm/${userID}" style="color: blue; text-decoration: none;">Click Here to Confirm</a>
        <p>If you didn't sign up for this service, you can safely ignore this email.</p>`,
    });
    console.log('Mail Have Been Successfully Sent!');
    return mailing;
  } catch (err) {
    console.log(err, 'Error Shows this doesnt work');
  }
};

const forgetPasswordEmail = async (header, firstName, email, resetToken) => {
  try {
    const sendMail = await mailTransport.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: 'Password Reset from EventTrack',
      html: `<h1>Password Reset</h1>
        <h2>Hello ${firstName},</h2>
        <p>You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p>
        <p> Please click on the following link, or paste this into your browser to complete the process:</p>
        <a href="http://${header}/api/user/reset-password/${resetToken}" style="color: blue; text-decoration: none;">Click Here to Reset Your Password</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    });
    return sendMail;
  } catch (err) {
    console.log('Error Sending forget Password Reset: ', err);
  }
};

module.exports = { forgetPasswordEmail, sendConfirmationEmail };
