import { Request, Response } from 'express';
import config from '../../config';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import UserService from './user.service';
import {
  updateProfileZodSchema,
  changePasswordZodSchema,
  myListingsQueryZodSchema,
  becomeSellerZodSchema,
} from './user.validation';

/**
 * Get profile of currently authenticated user with populated location hierarchy
 * GET /api/users/profile/me
 */
export const getMyProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'Unauthorized access: user identity not verified');
    }

    const userProfile = await UserService.getMyProfile(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User profile retrieved successfully',
      data: userProfile,
    });
  }
);

/**
 * Update authenticated user profile and location
 * PATCH /api/users/profile
 */
export const updateProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'Unauthorized access: user identity not verified');
    }

    const validationResult = updateProfileZodSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues
        .map((issue) => issue.message)
        .join(', ');
      throw new AppError(400, errorMsg);
    }

    const updatedProfile = await UserService.updateProfile(
      userId,
      validationResult.data
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User profile updated successfully',
      data: updatedProfile,
    });
  }
);

/**
 * Change authenticated user's password
 * Hashes new password with 12 salt rounds and invalidates active session/refresh tokens
 * PATCH /api/users/profile/change-password
 */
export const changePassword = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'Unauthorized access: user identity not verified');
    }

    const validationResult = changePasswordZodSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues
        .map((issue) => issue.message)
        .join(', ');
      throw new AppError(400, errorMsg);
    }

    await UserService.changePassword(userId, validationResult.data);

    // Invalidate refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
    });
    res.clearCookie('refreshToken');

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Password changed successfully',
      data: null,
    });
  }
);

/**
 * Retrieve listings created by the authenticated user
 * Supports status filter and pagination
 * GET /api/users/profile/my-listings
 */
export const getMyListings = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'Unauthorized access: user identity not verified');
    }

    const validationResult = myListingsQueryZodSchema.safeParse(req.query);
    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues
        .map((issue) => issue.message)
        .join(', ');
      throw new AppError(400, errorMsg);
    }

    const result = await UserService.getMyListings(
      userId,
      validationResult.data
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User listings retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

/**
 * Onboard regular user as a seller
 * PATCH /api/users/become-seller
 */
export const becomeSeller = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'Unauthorized access: user identity not verified');
    }

    const validationResult = becomeSellerZodSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues
        .map((issue) => issue.message)
        .join(', ');
      throw new AppError(400, errorMsg);
    }

    const updatedUser = await UserService.becomeSeller(
      userId,
      validationResult.data
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Seller onboarding completed successfully. You can now post products.',
      data: updatedUser,
    });
  }
);

export const UserController = {
  getMyProfile,
  updateProfile,
  changePassword,
  getMyListings,
  becomeSeller,
};

export default UserController;
