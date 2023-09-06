const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTHTOKEN;


const sendVerificationCode = async (phone, verificationCode) => {
  try {
 
    await sendMessage(phone, verificationCode);
    return `Verification code sent to ${phone}`;
  } catch (error) {
    console.error('Error sending Twilio SMS:', error.message);
    throw error;
  }
};

const sendMessage = async (phone, verificationCode) => {
  const twilioClient = twilio(accountSid, authToken);
  try {
    const message = await twilioClient.messages.create({
      body: `Your verification code: ${verificationCode}`,
      to: phone,
      from: '+15005550006', // Your Twilio phone number
    });

    console.log(message.body);
  } catch (err) {
    console.error('Error sending SMS:', err.message);
    throw err;
  }
};

module.exports = sendVerificationCode;
