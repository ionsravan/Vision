var SibApiV3Sdk = require("sib-api-v3-sdk");
SibApiV3Sdk.ApiClient.instance.authentications[
  "api-key"
].apiKey = `${process.env.SEND_IN_BLUE_API_KEY}`;

const sendEmail = async (emailId = "", fullName = "", code = "") => {
  new SibApiV3Sdk.TransactionalEmailsApi()
    .sendTransacEmail({
      subject: "Email verification for VISION APP ",
      sender: { email: "mywork.ioninks@gmail.com", name: "Vision" },
      replyTo: { email: "mywork.ioninks@gmail.com", name: "Vision" },
      to: [{ name: `${fullName}`, email: `${emailId}` }],
      htmlContent:
        "<html><body><center><h1>Hi {{params.name}}</h1><h4>Your verification code is</h4><h2 style='font-size:50px'>{{params.code}}</h2><p>The code will expire in 5 minutes</p><p>Do not share this code with anyone.</p></center> </body></html>",
      params: { name: `${fullName}`, code: `${code}` },
    })
    .then(
      function (data) {},
      function (error) {
        console.error(error);
        throw error;
      }
    );
};

module.exports = sendEmail;
