const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTHTOKEN;  

const  sendVerificationCode = async function (event, context) {

  try {
     const message = await  sendMessage(event, context);
   } catch (error) {
     console.log('error', error);
   }

  // return context.logStreamName;
}
  
  const sendMessage = async (phone, verificationCode) => {
    const twilioClient = twilio(accountSid, authToken);
    return twilioClient.messages.create({
      body: `Your verification code: ${verificationCode}`,
      to: phone,
      from: '+15005550006', // Your Twilio phone number
    }).then((message) => console.log(message.body)).catch(err => console.log("Delivery error: ", err));;
    console.log(twilioClient.body)
  };

  module.exports =  sendVerificationCode