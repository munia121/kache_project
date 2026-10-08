import { Request, Response } from 'express';
import { UserStatus } from '@prisma/client';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { comparePassword, generateToken } from '../../utils/auth';

/**
 * Log in an existing user
 * Validates credentials, verifies user status is ACTIVE, and verifies email is verified
 */
export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { phone, email, password } = req.body;

  if ((!phone && !email) || !password) {
    throw new AppError(400, 'Phone or email, and password are required');
  }

  // Find user by phone or email
  let user = null;
  if (phone) {
    const normalizedPhone = String(phone).trim();
    user = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });
  } else if (email) {
    const normalizedEmail = String(email).trim().toLowerCase();
    user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
  }

  if (!user) {
    throw new AppError(401, phone ? 'Invalid phone number or password' : 'Invalid email or password');
  }

  // Check user active status
  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(403, `Account is not active. Current status: ${user.status}`);
  }

  // Verify password
  const isPasswordMatch = await comparePassword(password, user.passwordHash);
  if (!isPasswordMatch) {
    throw new AppError(401, phone ? 'Invalid phone number or password' : 'Invalid email or password');
  }

  // Check if email is verified
  if (!user.isEmailVerified) {
    throw new AppError(403, 'Please verify your email first before logging in.');
  }

  // Generate JWT token
  const token = generateToken({
    id: user.id,
    phone: user.phone,
    role: user.role,
  });

  // Exclude passwordHash from response
  const { passwordHash: _, ...userWithoutPassword } = user;

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully',
    data: {
      user: userWithoutPassword,
      token,
    },
  });
});

export default login;
