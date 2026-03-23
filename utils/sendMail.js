const nodemailer = require("nodemailer");

const sendMail = async (to) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Welcome to Nestify 🎉",
    html: `
      <h2>Welcome to Nestify 🏡</h2>
      <p>Thanks for subscribing! You'll get the best travel deals.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;