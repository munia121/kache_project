import { NextFunction, Request, Response } from 'express';
import { UserStatus } from '@prisma/client';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import { verifyJwtToken } from '../utils/auth';
import prisma from '../config/prismaClient';

/**
 * Middleware to verify JWT token from Authorization header
 * Sets authenticated user payload on req.user
 */
export const verifyToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Authorization token is required (Format: Bearer <token>)');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError(401, 'Token missing');
    }

    let decoded: any;
    try {
      decoded = verifyJwtToken(token);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError(401, 'Token has expired');
      }
      throw new AppError(401, 'Invalid or corrupted token');
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError(404, 'User does not exist');
    }

    // Verify user status is ACTIVE
    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError(403, `User account is not active. Current status: ${user.status}`);
    }

    // Attach decoded user information to request
    req.user = {
      id: user.id,
      phone: user.phone,
      role: user.role,
      email: user.email,
    };

    next();
  }
);

export default verifyToken;
