import nodemailer from 'nodemailer';
import env from '../config/env.js';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!env.smtp.host || !env.smtp.user) {
    console.warn('SMTP not configured. Emails will be logged to console.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: env.smtp.from,
    to,
    subject,
    html,
    text,
  };

  const transport = getTransporter();

  if (!transport) {
    console.log('--- EMAIL (dev mode) ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text || html);
    console.log('------------------------');
    return { messageId: 'dev-mode' };
  }

  return transport.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${env.clientUrl}/reset-password?token=${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af;">Easy Home Solutions ERP</h2>
      <p>You requested a password reset. Click the button below to set a new password:</p>
      <a href="${resetUrl}" 
         style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 6px; margin: 16px 0;">
        Reset Password
      </a>
      <p>This link expires in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #6b7280; font-size: 12px;">
        Or copy this link: ${resetUrl}
      </p>
    </div>
  `;

  const text = `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`;

  return sendEmail({
    to: email,
    subject: 'Password Reset - Easy Home Solutions ERP',
    html,
    text,
  });
};

export default { sendEmail, sendPasswordResetEmail };
