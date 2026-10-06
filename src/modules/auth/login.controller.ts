import { Request, Response } from 'express';
import { UserStatus } from '@prisma/client';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { comparePassword, generateToken } from '../../utils/auth';

/**
 * Log in an existing user
 * Validates credentials and verifies user status is ACTIVE
 */
export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    throw new AppError(400, 'Phone and password are required');
  }

  const normalizedPhone = String(phone).trim();

  // Find user by phone number
  const user = await prisma.user.findUnique({
    where: { phone: normalizedPhone },
  });

  if (!user) {
    throw new AppError(401, 'Invalid phone number or password');
  }

  // Check user active status
  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(403, `Account is not active. Current status: ${user.status}`);
  }

  // Verify password
  const isPasswordMatch = await comparePassword(password, user.passwordHash);
  if (!isPasswordMatch) {
    throw new AppError(401, 'Invalid phone number or password');
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
