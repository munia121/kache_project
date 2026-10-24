import { Router } from 'express';
import { CategoryController } from './category.controller';
import { verifyToken, authorize } from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// ==========================================
// Public Routes
// ==========================================

/**
 * @route   GET /api/categories
 * @desc    Get all categories (public)
 * @access  Public
 */
router.get('/', CategoryController.getAllCategories);

/**
 * @route   GET /api/categories/id/:id
 * @desc    Get category details by UUID (public)
 * @access  Public
 */
router.get('/id/:id', CategoryController.getCategoryById);

/**
 * @route   GET /api/categories/:slug
 * @desc    Get category details by slug (public)
 * @access  Public
 */
router.get('/:slug', CategoryController.getCategoryBySlug);

// ==========================================
// Protected Routes
// ==========================================

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Authenticated (ADMIN, SUPER_ADMIN)
 */
router.post(
  '/',
  verifyToken,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  CategoryController.createCategory
);

/**
 * @route   PATCH /api/categories/:id
 * @desc    Update category by UUID
 * @access  ADMIN only
 */
router.patch(
  '/:id',
  verifyToken,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  CategoryController.updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Soft delete category by UUID (isActive: false)
 * @access  ADMIN only
 */
router.delete(
  '/:id',
  verifyToken,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;
export default router;
