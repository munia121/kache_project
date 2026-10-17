import { Router } from 'express';
import { ProductController } from './product.controller';
import { verifyToken, optionalAuth } from '../../middlewares/auth';
import { uploadProductImages } from '../../middlewares/upload';

const router = Router();

// ==========================================
// Authenticated Specific Routes
// (Placed before parameterized :slug to prevent collisions)
// ==========================================

/**
 * @route   GET /api/products/user/my-listings
 * @desc    Get listings belonging to the authenticated user
 * @access  Authenticated (Any logged in user)
 */
router.get('/user/my-listings', verifyToken, ProductController.getMyProducts);

// ==========================================
// Public Routes
// ==========================================

/**
 * @route   GET /api/products
 * @desc    Get all active product listings with filters & pagination
 * @access  Public (supports optional authentication for privileged admin/seller query filters)
 */
router.get('/', optionalAuth, ProductController.getAllProducts);

/**
 * @route   GET /api/products/id/:id
 * @desc    Get product details by UUID
 * @access  Public
 */
router.get('/id/:id', ProductController.getProductById);

/**
 * @route   GET /api/products/:slug
 * @desc    Get product details by unique slug (auto increments viewsCount)
 * @access  Public
 */
router.get('/:slug', ProductController.getProductBySlug);

// ==========================================
// Protected Routes (verifyToken)
// ==========================================

/**
 * @route   POST /api/products
 * @desc    Create a new product listing (supports multipart/form-data images)
 * @access  Authenticated (Any logged in user)
 */
router.post(
  '/',
  verifyToken,
  uploadProductImages,
  ProductController.createProduct
);

/**
 * @route   PATCH /api/products/:id
 * @desc    Update an existing product listing (supports multipart/form-data images)
 * @access  Authenticated (Owner or ADMIN/SUPER_ADMIN)
 */
router.patch(
  '/:id',
  verifyToken,
  uploadProductImages,
  ProductController.updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Remove or archive a product listing
 * @access  Authenticated (Owner or ADMIN/SUPER_ADMIN)
 */
router.delete('/:id', verifyToken, ProductController.deleteProduct);

export const ProductRoutes = router;
export default router;
