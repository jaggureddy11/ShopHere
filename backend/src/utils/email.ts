import nodemailer from 'nodemailer';

interface MailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

export const sendEmail = async (options: MailOptions): Promise<void> => {
  let transporter;

  const hasConfig =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (hasConfig) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Generate a test account on the fly for development
    console.log('[EMAIL] Generating Ethereal SMTP test account on the fly...');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }

  const mailOptions = {
    from: `"${process.env.NEXT_PUBLIC_APP_NAME || 'Shop Here'}" <no-reply@shophere.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[EMAIL] Message sent: %s`, info.messageId);

  // If using Ethereal, log the preview URL
  if (!hasConfig) {
    console.log(`[EMAIL] Preview URL: %s`, nodemailer.getTestMessageUrl(info));
  }
};
