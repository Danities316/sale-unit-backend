const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTHTOKEN;

const sendVerificationCode = async function (event, context) {
  try {
    return await sendMessage(event, context);
  } catch (error) {
    console.error('Error sending Twilio sms:', error.message);
    return res.status(500).json('Error sending Twilio sms:');
  }
};

const sendMessage = async (phone, verificationCode) => {
  const twilioClient = twilio(accountSid, authToken);
  return twilioClient.messages
    .create({
      body: `Your verification code: ${verificationCode}`,
      to: phone,
      from: '+15005550006', // Your Twilio phone number
    })
    .then((message) => console.log(message.body))
    .catch((err) => {
      return console.error('Error sending SMS:', err.message);
    });
  console.log(twilioClient.body);
};

module.exports = sendVerificationCode;
