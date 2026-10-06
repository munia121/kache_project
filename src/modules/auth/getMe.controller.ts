import { Request, Response } from 'express';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

/**
 * Get profile of currently logged in user
 * Excludes passwordHash
 */
export const getMe = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, 'Unauthorized access: user identity not verified');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
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
      latitude: true,
      longitude: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, 'User profile not found');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Current user profile retrieved successfully',
    data: user,
  });
});

export default getMe;
