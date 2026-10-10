import { Request, Response } from 'express';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { hashPassword } from '../../utils/auth';
import { getOtp, deleteOtp } from '../../utils/otp';

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

  // Get OTP from Redis
  const savedOtp = await getOtp(normalizedEmail);

  if (!savedOtp) {
    throw new AppError(400, 'OTP code has expired or not found. Please request an OTP first.');
  }

  // Verify OTP code
  if (savedOtp !== normalizedCode) {
    throw new AppError(400, 'Invalid OTP code');
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

  // Delete used OTP from Redis
  await deleteOtp(normalizedEmail);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password reset successfully. You can now login with your new password.',
    data: null,
  });
});

export default resetPassword;
