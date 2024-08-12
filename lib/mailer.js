const nodemailer = require('nodemailer');
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Free SMTP server address
  port: process.env.EMAIL_PORT,                      // Port number
  secure: false,                     // Use false for port 25
  auth: {
    user: '',                        // No authentication required
    pass: ''
  },
  tls: {
    rejectUnauthorized: false        // Accept self-signed certificates
  },
  connectionTimeout: 10000,          // Optional: 10 seconds timeout
});

async function sendEmail(from, to, subject, text) {
  try {
    let info = await transporter.sendMail({
      from: from,  // sender address
      to: to,      // receiver address
      subject: subject, // Subject line
      text: text,  // plain text body
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email: %s', error);
    throw error;
  }
}

module.exports = { sendEmail };
