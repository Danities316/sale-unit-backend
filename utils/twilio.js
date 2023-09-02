const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTHTOKEN;  
  
  exports.sendVerificationCode = async (phone, verificationCode) => {
    const twilioClient = twilio(accountSid, authToken);
    await twilioClient.messages.create({
      body: `Your verification code: ${verificationCode}`,
      to: phone,
      from: '+15005550006', // Your Twilio phone number
    });
  };