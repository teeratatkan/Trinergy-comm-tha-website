const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Load .env
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

function createTransport() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/* POST /api/contact */
router.post('/', async (req, res) => {
  const { name, company, email, solution, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' });
  }

  const to   = process.env.CONTACT_TO   || 'Teeratat.kanok@tricomm.co.th';
  const from = `"${process.env.CONTACT_FROM_NAME || 'Trinergy Website'}" <${process.env.SMTP_USER}>`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0d1a0f; border-bottom: 3px solid #4ade80; padding: 28px 32px;">
        <h2 style="color: #4ade80; margin: 0; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.06em;">
          New Contact Form Submission
        </h2>
        <p style="color: #a3a3a3; margin: 6px 0 0; font-size: 0.85rem;">Trinergy Comm-THA Website</p>
      </div>

      <div style="background: #111; padding: 32px; border: 1px solid #262626; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #1e1e1e; color: #737373; font-size: 0.8rem; width: 130px; vertical-align: top;">NAME</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #1e1e1e; color: #f5f5f5; font-size: 0.9rem;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #1e1e1e; color: #737373; font-size: 0.8rem; vertical-align: top;">COMPANY</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #1e1e1e; color: #f5f5f5; font-size: 0.9rem;">${company || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #1e1e1e; color: #737373; font-size: 0.8rem; vertical-align: top;">EMAIL</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #1e1e1e; font-size: 0.9rem;">
              <a href="mailto:${email}" style="color: #4ade80;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #1e1e1e; color: #737373; font-size: 0.8rem; vertical-align: top;">SOLUTION</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #1e1e1e; color: #f5f5f5; font-size: 0.9rem;">${solution || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 14px 0 4px; color: #737373; font-size: 0.8rem; vertical-align: top;">MESSAGE</td>
            <td style="padding: 14px 0 4px;"></td>
          </tr>
        </table>
        <div style="background: #0a0a0a; border: 1px solid #262626; border-radius: 8px; padding: 18px; color: #d4d4d4; font-size: 0.9rem; line-height: 1.7; white-space: pre-wrap;">${message}</div>
      </div>

      <div style="background: #0a0a0a; padding: 16px 32px; border: 1px solid #262626; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="color: #525252; font-size: 0.75rem; margin: 0;">
          Sent from the contact form at trinergycomm-tha.com
        </p>
      </div>
    </div>
  `;

  try {
    const transporter = createTransport();
    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject: `[Website] New inquiry from ${name}${company ? ` (${company})` : ''}`,
      html,
    });
    return res.json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Email send error:', err.message);
    return res.status(500).json({ error: 'Failed to send email. Please try again or contact us directly.' });
  }
});

module.exports = router;
