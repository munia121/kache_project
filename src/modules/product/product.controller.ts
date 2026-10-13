import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import validateUUID from '../../utils/validateUUID';
import ProductService from './product.service';

/**
 * Get all product listings with filtering, search, and pagination
 * GET /api/products
 */
export const getAllProducts = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const result = await ProductService.getAllProducts(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Products retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

/**
 * Get product listing by unique slug
 * GET /api/products/:slug
 */
export const getProductBySlug = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const rawSlug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    if (!rawSlug || typeof rawSlug !== 'string' || rawSlug.trim() === '') {
      throw new AppError(400, 'Product slug parameter is required');
    }

    const product = await ProductService.getProductBySlug(rawSlug.trim());

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  }
);

/**
 * Get product listing by UUID
 * GET /api/products/id/:id
 */
export const getProductById = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = validateUUID(req.params.id);
    const product = await ProductService.getProductById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  }
);

/**
 * Create a new product listing
 * POST /api/products
 */
export const createProduct = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized access: user identity not verified');
    }

    const { title, description, price } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new AppError(400, 'Title is required and must be a non-empty string');
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      throw new AppError(400, 'Description is required and must be a non-empty string');
    }

    if (price === undefined || price === null || isNaN(Number(price))) {
      throw new AppError(400, 'Valid numeric price is required');
    }

    if (Number(price) < 0) {
      throw new AppError(400, 'Price must be a non-negative number');
    }

    const product = await ProductService.createProduct(req.user.id, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Product listing created successfully',
      data: product,
    });
  }
);

/**
 * Get listings belonging to the authenticated user
 * GET /api/products/user/my-listings
 */
export const getMyProducts = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized access: user identity not verified');
    }

    const result = await ProductService.getMyProducts(req.user.id, req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User product listings retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

/**
 * Update an existing product listing
 * Ownership Guard: product.sellerId === req.user.id or ADMIN/SUPER_ADMIN
 * PATCH /api/products/:id
 */
export const updateProduct = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized access: user identity not verified');
    }

    const id = validateUUID(req.params.id);
    const existingProduct = await ProductService.getProductById(id);

    const isOwner = existingProduct.sellerId === req.user.id;
    const isAdmin =
      req.user.role === Role.ADMIN || req.user.role === Role.SUPER_ADMIN;

    if (!isOwner && !isAdmin) {
      throw new AppError(
        403,
        'Forbidden: You do not have permission to update this product listing'
      );
    }

    const updatedProduct = await ProductService.updateProduct(id, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Product listing updated successfully',
      data: updatedProduct,
    });
  }
);

/**
 * Remove or archive product listing
 * Ownership Guard: product.sellerId === req.user.id or ADMIN/SUPER_ADMIN
 * DELETE /api/products/:id
 */
export const deleteProduct = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized access: user identity not verified');
    }

    const id = validateUUID(req.params.id);
    const existingProduct = await ProductService.getProductById(id);

    const isOwner = existingProduct.sellerId === req.user.id;
    const isAdmin =
      req.user.role === Role.ADMIN || req.user.role === Role.SUPER_ADMIN;

    if (!isOwner && !isAdmin) {
      throw new AppError(
        403,
        'Forbidden: You do not have permission to delete this product listing'
      );
    }

    const permanent = req.query.permanent === 'true';
    const deletedProduct = await ProductService.deleteProduct(id, permanent);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: permanent
        ? 'Product listing deleted permanently'
        : 'Product listing archived successfully',
      data: deletedProduct,
    });
  }
);

export const ProductController = {
  getAllProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
};

export default ProductController;
