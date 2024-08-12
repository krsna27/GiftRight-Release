// pages/api/send-email.js
import { sendEmail } from '../../lib/mailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    const emailContent = `
      Name: ${name}\n
      Email: ${email}\n
      Message: ${message}
    `;

    try {
      const info = await sendEmail(email, process.env.SUPPORT_EMAIL, 'Contact Form Submission', emailContent);
      res.status(200).json({ message: 'Email sent successfully', info });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
