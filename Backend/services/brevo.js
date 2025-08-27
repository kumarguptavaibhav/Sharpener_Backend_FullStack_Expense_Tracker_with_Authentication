const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sender = {
  email: "vaibhav9161porwal@gmail.com",
  name: "Vaibhav",
};

async function sendMail(name, email) {
  try {
    const receivers = [
      {
        name: name,
        email: email,
      },
    ];
    const response = await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Forgot Password",
      textContent: "This email is used for resetting the password.",
    });
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = sendMail;
