import crypto from 'crypto';
import { Request, Response } from 'express';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import sendEmail from '../../utils/sendEmail';

/**
 * Resend a new OTP to user's email
 * Expects { email } in request body
 */
export const resendOtp = catchAsync(async (req: Request, res: Response): Promise<void> => {
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
    throw new AppError(404, 'User with this email not found');
  }

  // ============================================================================
  // [TESTING MODE] - Commented out so you can test resend OTP repeatedly with the same email
  // ============================================================================
  /*
  // Check if user is already verified
  if (user.isEmailVerified) {
    throw new AppError(400, 'Email is already verified. You can log in directly.');
  }
  */

  // Generate new secure 6-digit random OTP
  const otpCode = crypto.randomInt(100000, 1000000).toString();

  // Expiration set to 3 minutes from now
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

  // Delete any existing OTPs for this email to maintain clean state
  await prisma.otp.deleteMany({
    where: { email: normalizedEmail },
  });

  // Save fresh OTP in database
  await prisma.otp.create({
    data: {
      email: normalizedEmail,
      code: otpCode,
      expiresAt,
    },
  });

  // Send new OTP email via nodemailer
  try {
    await sendEmail({
      to: normalizedEmail,
      subject: 'কাছে (Kache) - নতুন ওটিপি কোড (Resend OTP)',
      otp: otpCode,
      title: 'নতুন ওটিপি কোড (Resend OTP)',
      purpose: 'আপনার অনুরোধের প্রেক্ষিতে একটি নতুন ওটিপি কোড পাঠানো হয়েছে। অ্যাকাউন্ট নিশ্চিত করতে নিচের কোডটি ব্যবহার করুন:',
    });
  } catch (error) {
    console.error('Failed to send resend verification email:', error);
  }

  const isDevWithoutSmtp =
    process.env.NODE_ENV !== 'production' && !process.env.SMTP_USER;

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'A new OTP has been sent to your email.',
    data: isDevWithoutSmtp ? { devOtp: otpCode } : null,
  });
});

export default resendOtp;
