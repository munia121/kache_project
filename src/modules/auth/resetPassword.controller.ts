import { Request, Response } from 'express';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { hashPassword } from '../../utils/auth';

/**
 * Reset password using OTP code
 * Expects { email, code, newPassword } in request body
 */
export const resetPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    throw new AppError(400, 'Email, OTP code, and newPassword are required');
  }

  if (String(newPassword).length < 6) {
    throw new AppError(400, 'Password must be at least 6 characters long');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedCode = String(code).trim();

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new AppError(404, 'No account found with this email address');
  }

  // Find latest OTP for this email
  const otpRecord = await prisma.otp.findFirst({
    where: { email: normalizedEmail },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    throw new AppError(400, 'No OTP request found for this email. Please request an OTP first.');
  }

  // Verify OTP code
  if (otpRecord.code !== normalizedCode) {
    throw new AppError(400, 'Invalid OTP code');
  }

  // Verify expiration
  if (otpRecord.expiresAt <= new Date()) {
    await prisma.otp.deleteMany({
      where: { email: normalizedEmail },
    });
    throw new AppError(400, 'OTP code has expired. Please request a new one.');
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Update password in database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newPasswordHash,
    },
  });

  // Delete used OTP
  await prisma.otp.deleteMany({
    where: { email: normalizedEmail },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password reset successfully. You can now login with your new password.',
    data: null,
  });
});

export default resetPassword;
