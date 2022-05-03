const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const route = "verifyEmail";
  const verifyEmail = `${origin}/verify/?token=${verificationToken}&email=${email}&route=${route}`;
  console.log(verifyEmail);
  const message = `<p>Please confirm your email by clicking on the following link : 
    <a href="${verifyEmail}">Verify Email</a> </p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4> Hello, ${name}</h4>
        ${message}
        `,
  });
};

module.exports = sendVerificationEmail;
