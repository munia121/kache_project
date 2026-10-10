import crypto from 'crypto';
import { Request, Response } from 'express';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import sendEmail from '../../utils/sendEmail';
import { saveOtp } from '../../utils/otp';

/**
 * Initiate Forgot Password by sending OTP to user's email
 * Expects { email } in request body
 */
export const forgotPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    throw new AppError(400, 'Email is required');
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new AppError(404, 'No account found with this email address');
  }

  // Generate 6-digit random OTP
  const otpCode = crypto.randomInt(100000, 1000000).toString();

  // Save OTP in Redis with 5 minutes (300s) TTL
  await saveOtp(normalizedEmail, otpCode, 300);

  // Send OTP email via nodemailer
  try {
    await sendEmail({
      to: normalizedEmail,
      subject: 'কাছে (Kache) - পাসওয়ার্ড রিসেট ওটিপি কোড',
      otp: otpCode,
      title: 'পাসওয়ার্ড রিসেট ওটিপি কোড',
      purpose: 'আপনার অ্যাকাউন্টের পাসওয়ার্ড রিসেট করার জন্য অনুরোধ করা হয়েছে। পাসওয়ার্ড পরিবর্তন করতে নিচের ওটিপি (OTP) কোডটি ব্যবহার করুন:',
    });
  } catch (error) {
    console.error('Failed to send forgot password email:', error);
  }

  const isDevWithoutSmtp =
    process.env.NODE_ENV !== 'production' && !process.env.SMTP_USER;

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password reset OTP has been sent to your email.',
    data: isDevWithoutSmtp ? { devOtp: otpCode } : null,
  });
});

export default forgotPassword;
