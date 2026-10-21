import { Router } from 'express';
import { UserController } from './user.controller';
import { verifyToken as auth } from '../../middlewares/auth';

const router = Router();

// ==========================================
// User Profile Routes (Protected)
// ==========================================

/**
 * @route   GET /api/users/profile/me
 * @desc    Get profile of the currently logged-in user with nested location hierarchy
 * @access  Protected
 */
router.get('/profile/me', auth, UserController.getMyProfile);

/**
 * @route   GET /api/users/profile
 * @desc    Alias for /api/users/profile/me
 * @access  Protected
 */
router.get('/profile', auth, UserController.getMyProfile);

/**
 * @route   PATCH /api/users/profile/change-password
 * @desc    Change current user password (hashes with salt rounds 12, clears session)
 * @access  Protected
 */
router.patch('/profile/change-password', auth, UserController.changePassword);

/**
 * @route   GET /api/users/profile/my-listings
 * @desc    Get listings created by the authenticated user with filters & pagination
 * @access  Protected
 */
router.get('/profile/my-listings', auth, UserController.getMyListings);

/**
 * @route   PATCH /api/users/profile
 * @desc    Update user profile information and location hierarchy
 * @access  Protected
 */
router.patch('/profile', auth, UserController.updateProfile);

export const UserRoutes = router;
export default router;
