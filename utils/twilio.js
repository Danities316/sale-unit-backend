const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTHTOKEN;

<<<<<<< HEAD

const sendVerificationCode = async (phone, verificationCode) => {
  try {
 
    await sendMessage(phone, verificationCode);
    return `Verification code sent to ${phone}`;
  } catch (error) {
    console.error('Error sending Twilio SMS:', error.message);
    throw error;
=======
const sendVerificationCode = async function (event, context) {
  try {
    return await sendMessage(event, context);
  } catch (error) {
    return console.error('Error sending Twilio sms:', error.message);
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
  }
};

const sendMessage = async (phone, verificationCode) => {
  const twilioClient = twilio(accountSid, authToken);
<<<<<<< HEAD
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
=======
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
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
};

module.exports = sendVerificationCode;
