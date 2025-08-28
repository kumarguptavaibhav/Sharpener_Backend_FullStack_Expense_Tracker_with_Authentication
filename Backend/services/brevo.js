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
