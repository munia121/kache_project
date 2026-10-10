import { Request, Response } from 'express';
import config from '../../config';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { generateAccessToken, generateRefreshToken } from '../../utils/auth';
import { getOtp, deleteOtp } from '../../utils/otp';

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

  // Get OTP from Redis
  const savedOtp = await getOtp(normalizedEmail);

  if (!savedOtp) {
    throw new AppError(400, 'OTP code has expired or not found. Please request a new one.');
  }

  // Verify OTP code
  if (savedOtp !== normalizedCode) {
    throw new AppError(400, 'Invalid OTP code');
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

  // Delete used OTP from Redis
  await deleteOtp(normalizedEmail);

  // Generate JWT access & refresh tokens for auto-login
  const tokenPayload = {
    id: updatedUser.id,
    phone: updatedUser.phone,
    role: updatedUser.role,
    email: updatedUser.email,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Set refreshToken in HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OTP verified successfully. Logged in automatically.',
    data: {
      user: updatedUser,
      accessToken,
      refreshToken,
      token: accessToken,
    },
  });
});

export default verifyOtp;
