const nodemailer = require("nodemailer");

exports.sendTicketConfirmation = async (toEmail) => {
  try {
    // Create a test account using Ethereal
    const testAccount = await nodemailer.createTestAccount();

    // Create a transporter using the test SMTP
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: '"Support Desk 👩‍💻" <no-reply@support.com>',
      to: toEmail,
      subject: "Your support ticket has been created ✅",
      text: "Thank you for contacting support. We have received your ticket.",
      html: "<b>Thank you for contacting support.</b><br>Your ticket has been created successfully!",
    });

    // Log the preview URL
    console.log("✅ Email sent. Preview it here:", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
  }
};
