import nodemailer from 'nodemailer';
import config from '../config';

/**
 * Options interface for sendEmail function
 */
export interface ISendEmailOptions {
  to: string;
  subject?: string;
  otp?: string;
  title?: string;
  purpose?: string;
  html?: string;
  text?: string;
}

/**
 * Generates a clean, branded HTML email template for Kache marketplace OTP verification
 * @param otp The 6-digit OTP code
 * @param title Custom heading for the email
 * @param purpose Custom instruction description
 * @returns HTML string
 */
export const generateOtpEmailTemplate = (
  otp: string,
  title: string = 'ইমেইল যাচাইকরণ ওটিপি কোড',
  purpose: string = 'কাছে (Kache) লোকাল মার্কেটপ্লেসে স্বাগতম! আপনার অ্যাকাউন্ট নিশ্চিত করতে নিচের ওটিপি (OTP) কোডটি ব্যবহার করুন:'
): string => {
  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>কাছে (Kache) - ওটিপি ভেরিফিকেশন</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; color: #333333;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #f4f6f9; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
          
          <!-- Header with Brand Accent -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #0f766e 0%, #047857 100%); padding: 36px 20px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 30px; font-weight: 700; letter-spacing: 0.5px;">
                কাছে <span style="font-size: 22px; font-weight: 400; opacity: 0.9;">(Kache)</span>
              </h1>
              <p style="margin: 6px 0 0; color: #ccfbf1; font-size: 14px; font-weight: 400; letter-spacing: 0.3px;">
                আপনার বিশ্বস্ত লোকাল মার্কেটপ্লেস
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px;">
              <h2 style="margin: 0 0 14px; color: #111827; font-size: 20px; font-weight: 600; text-align: center;">
                ${title}
              </h2>
              <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.6; text-align: center;">
                ${purpose}
              </p>

              <!-- OTP Code Display Box -->
              <div style="background-color: #f0fdf4; border: 2px dashed #059669; border-radius: 12px; padding: 22px; text-align: center; margin-bottom: 24px;">
                <span style="display: block; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #065f46; font-family: 'Courier New', Courier, monospace;">
                  ${otp}
                </span>
                <p style="margin: 10px 0 0; font-size: 13px; font-weight: 600; color: #dc2626;">
                  ⏳ এই কোডটির মেয়াদ মাত্র ৩ মিনিট (Valid for 3 minutes only)
                </p>
              </div>

              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.5;">
                  🔒 <strong>নিরাপত্তা সতর্কতা:</strong> এই ওটিপি কোডটি অত্যন্ত সংবেদনশীল। কারও সাথে (এমনকি কাছে সাপোর্ট টিমের সাথেও) এই কোডটি শেয়ার করবেন না।
                </p>
              </div>

              <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5; text-align: center;">
                আপনি যদি এই ওটিপির জন্য অনুরোধ না করে থাকেন, তবে অনুগ্রহ করে এই বার্তাটি উপেক্ষা করুন।
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} কাছে (Kache) লোকাল মার্কেটপ্লেস। সর্বস্বত্ব সংরক্ষিত।
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Creates and returns a configured nodemailer transporter
 */
export const getTransporter = () => {
  const host = (process.env.SMTP_HOST || config.smtp_host || '').trim();
  const port = parseInt(process.env.SMTP_PORT || String(config.smtp_port) || '587', 10);
  const user = (process.env.SMTP_USER || config.smtp_user || '').trim();
  let pass = (process.env.SMTP_PASS || config.smtp_pass || '').trim();

  // If using Gmail app password, spaces might be present: remove them
  if (pass) {
    pass = pass.replace(/\s+/g, '');
  }

  // Gmail special service handling
  if (host.includes('gmail') || user.endsWith('@gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }

  // Generic SMTP (Mailtrap, Brevo, SendGrid, custom server)
  return nodemailer.createTransport({
    host: host || 'sandbox.smtp.mailtrap.io',
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });
};

/**
 * Send an email using nodemailer
 * Supports either an options object or direct (to, otp) arguments
 */
export const sendEmail = async (
  optionsOrTo: ISendEmailOptions | string,
  otpCode?: string
): Promise<any> => {
  let to: string;
  let subject: string;
  let html: string;
  let text: string;
  let rawOtp: string | undefined;

  if (typeof optionsOrTo === 'string') {
    to = optionsOrTo.trim().toLowerCase();
    rawOtp = otpCode;
    subject = 'কাছে (Kache) - ইমেইল ভেরিফিকেশন ওটিপি কোড';
    html = rawOtp ? generateOtpEmailTemplate(rawOtp) : '';
    text = rawOtp
      ? `আপনার কাছে (Kache) ওটিপি কোড হলো: ${rawOtp}। এই কোডের মেয়াদ ৩ মিনিট।`
      : '';
  } else {
    to = optionsOrTo.to.trim().toLowerCase();
    rawOtp = optionsOrTo.otp;
    subject = optionsOrTo.subject || 'কাছে (Kache) - ইমেইল ভেরিফিকেশন ওটিপি কোড';

    if (rawOtp) {
      html =
        optionsOrTo.html ||
        generateOtpEmailTemplate(rawOtp, optionsOrTo.title, optionsOrTo.purpose);
      text =
        optionsOrTo.text ||
        `আপনার কাছে (Kache) ওটিপি কোড হলো: ${rawOtp}। এই কোডের মেয়াদ ৩ মিনিট।`;
    } else {
      html = optionsOrTo.html || '';
      text = optionsOrTo.text || '';
    }
  }

  const from =
    process.env.SMTP_FROM ||
    config.smtp_from ||
    (process.env.SMTP_USER ? `"কাছে (Kache)" <${process.env.SMTP_USER}>` : '"কাছে (Kache)" <no-reply@kache.com>');

  const user = (process.env.SMTP_USER || config.smtp_user || '').trim();
  const pass = (process.env.SMTP_PASS || config.smtp_pass || '').trim();

  // If SMTP is not yet configured in development environment:
  if (!user || !pass) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n==================================================');
      console.log('⚠️  [DEV MODE] SMTP_USER or SMTP_PASS not set in .env');
      console.log(`📩  Recipient : ${to}`);
      console.log(`🔑  OTP Code  : ${rawOtp || 'N/A'}`);
      console.log('💡  Tip: You can use this OTP directly to test in Postman!');
      console.log('==================================================\n');
      return {
        messageId: 'dev-mock-message-id',
        accepted: [to],
      };
    }
    throw new Error('SMTP credentials are not configured');
  }

  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
  };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [EMAIL SENT] Mail delivered to ${to} (MessageId: ${info.messageId})`);
    if (rawOtp && process.env.NODE_ENV !== 'production') {
      console.log(`🔑 [OTP CODE] ${rawOtp}`);
    }
    return info;
  } catch (error: any) {
    console.error('❌ Failed to send email via SMTP:', error?.message || error);

    // In development mode, log fallback OTP so testing doesn't break
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[DEV FALLBACK] SMTP failed. OTP for ${to} is: ${rawOtp}`
      );
      return {
        messageId: 'dev-fallback-message-id',
        accepted: [to],
      };
    }

    throw error;
  }
};

export default sendEmail;
