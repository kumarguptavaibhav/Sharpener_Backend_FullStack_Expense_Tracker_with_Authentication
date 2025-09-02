const Brevo = require("@getbrevo/brevo");
const sender_email = process.env.SENDER_EMAIL;
const sender_name = process.env.SENDER_NAME;

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sender = {
  email: sender_email,
  name: sender_name,
};

async function sendMail(name, email, request_url) {
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
      htmlContent: `
      <div style:"background-color: lightblue">
        <p>Hi ${name},</p>
        <p>Click below to reset your password:</p>
        <a href="${request_url}">Reset Password</a>
      </div>
      `,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = sendMail;
