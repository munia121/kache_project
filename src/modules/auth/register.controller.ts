import { Request, Response } from 'express';
import { Role, UserStatus } from '@prisma/client';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { hashPassword, generateToken } from '../../utils/auth';

/**
 * Register a new user
 * Handles fullName, phone, password, and optional email
 */
export const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { fullName, phone, password, email, area, address } = req.body;

  // Basic validation
  if (!fullName || !phone || !password) {
    throw new AppError(400, 'fullName, phone, and password are required fields');
  }

  const normalizedPhone = String(phone).trim();

  // Check if phone already exists
  const existingUserByPhone = await prisma.user.findUnique({
    where: { phone: normalizedPhone },
  });

  if (existingUserByPhone) {
    throw new AppError(409, 'User with this phone number already exists');
  }

  // Check if optional email already exists
  if (email) {
    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUserByEmail) {
      throw new AppError(409, 'User with this email already exists');
    }
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Save new user in database
  const newUser = await prisma.user.create({
    data: {
      fullName: String(fullName).trim(),
      phone: normalizedPhone,
      email: email ? String(email).trim().toLowerCase() : null,
      passwordHash,
      role: Role.USER,
      status: UserStatus.ACTIVE,
      area: area ? String(area).trim() : null,
      address: address ? String(address).trim() : null,
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      role: true,
      status: true,
      avatar: true,
      area: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Generate JWT token
  const token = generateToken({
    id: newUser.id,
    phone: newUser.phone,
    role: newUser.role,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: {
      user: newUser,
      token,
    },
  });
});

export default register;
