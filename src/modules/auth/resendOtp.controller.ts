import crypto from 'crypto';
import { Request, Response } from 'express';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import sendEmail from '../../utils/sendEmail';
import { saveOtp } from '../../utils/otp';

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

  // Save fresh OTP in Redis with 3 minutes (180s) TTL
  await saveOtp(normalizedEmail, otpCode, 180);

  // Send new OTP email via nodemailer
  try {
    await sendEmail({
      to: normalizedEmail,
      subject: 'Kache - Resend OTP Code',
      otp: otpCode,
      title: 'Resend OTP Code',
      purpose: 'A new OTP code has been generated based on your request. Please use the code below to verify your account:',
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
