const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendVerificationEmail = async (user, token) => {
  const url = `http://localhost:3000/api/auth/verify-email?token=${token}`;
  await transporter.sendMail({
    from: '"Appointment App" <no-reply@appointments.com>',
    to: user.email,
    subject: "Verify Your Email",
    html: `<h2>Hello ${user.name},</h2>
           <p>Please click the link below to verify your email:</p>
           <a href="${url}">${url}</a>`,
  });
};
