import nodemailer from "nodemailer";

export default async function sendEmail(to, subject, html) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // SMTP Server
      port: 465, // Use 465 for SSL, 587 for TLS
      secure: true, // SSL
      auth: {
        user: process.env.EMAIL_USER, // SMTP username
        pass: process.env.EMAIL_PASS, // SMTP password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.BRAND_NAME,
      to,
      subject,
      html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent:", info.messageId);

    return { success: true, message: "Email sent successfully" };

  } catch (error) {
    console.error("Email Sending Error:", error);
    return { success: false, message: "Failed to send email" };
  }
}
