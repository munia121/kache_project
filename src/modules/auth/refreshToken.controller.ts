import { Request, Response } from 'express';
import { UserStatus } from '@prisma/client';
import config from '../../config';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/auth';

/**
 * Generate a new access token using a valid refresh token
 * Reads refresh token from cookies (req.cookies.refreshToken) or request body (req.body.refreshToken)
 */
export const refreshToken = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    throw new AppError(401, 'Refresh token is required');
  }

  let decoded: any;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError(401, 'Refresh token has expired. Please log in again.');
    }
    throw new AppError(401, 'Invalid refresh token');
  }

  // Find user by id
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new AppError(404, 'User does not exist');
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(403, `Account is not active. Current status: ${user.status}`);
  }

  const tokenPayload = {
    id: user.id,
    phone: user.phone,
    role: user.role,
    email: user.email,
  };

  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  // Set new refresh token in HTTP-only cookie
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Access token refreshed successfully',
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      token: newAccessToken,
    },
  });
});

export default refreshToken;
