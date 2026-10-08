import { Request, Response } from 'express';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { generateToken } from '../../utils/auth';

/**
 * Verify OTP code and automatically log in the user
 * Expects { email, code } in request body
 */
export const verifyOtp = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { email, code } = req.body;

  if (!email || !code) {
    throw new AppError(400, 'Email and OTP code are required');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedCode = String(code).trim();

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new AppError(404, 'User with this email not found');
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

  // Verify expiration (expiresAt must be > new Date())
  if (otpRecord.expiresAt <= new Date()) {
    // Delete expired OTP
    await prisma.otp.deleteMany({
      where: { email: normalizedEmail },
    });
    throw new AppError(400, 'OTP code has expired. Please request a new one.');
  }

  // Update user isEmailVerified to true
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      role: true,
      status: true,
      avatar: true,
      isEmailVerified: true,
      area: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Delete used OTP
  await prisma.otp.deleteMany({
    where: { email: normalizedEmail },
  });

  // Generate JWT token for auto-login
  const token = generateToken({
    id: updatedUser.id,
    phone: updatedUser.phone,
    role: updatedUser.role,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OTP verified successfully. Logged in automatically.',
    data: {
      user: updatedUser,
      token,
    },
  });
});

export default verifyOtp;
