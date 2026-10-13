import { Router } from 'express';
import { ProductController } from './product.controller';
import { verifyToken } from '../../middlewares/auth';

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
 * @access  Public
 */
router.get('/', ProductController.getAllProducts);

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
 * @desc    Create a new product listing
 * @access  Authenticated (Any logged in user)
 */
router.post('/', verifyToken, ProductController.createProduct);

/**
 * @route   PATCH /api/products/:id
 * @desc    Update an existing product listing
 * @access  Authenticated (Owner or ADMIN/SUPER_ADMIN)
 */
router.patch('/:id', verifyToken, ProductController.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Remove or archive a product listing
 * @access  Authenticated (Owner or ADMIN/SUPER_ADMIN)
 */
router.delete('/:id', verifyToken, ProductController.deleteProduct);

export const ProductRoutes = router;
export default router;
