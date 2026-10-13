import { Request, Response } from 'express';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import CategoryService from './category.service';

/**
 * Standard UUID v4/v1/v3/v5 format validation regex
 */
import { validateUUID, UUID_REGEX } from '../../utils/validateUUID';
export { validateUUID, UUID_REGEX };

/**
 * Get all categories with optional isActive filter
 * Query: ?onlyActive=true/false, ?includeInactive=true
 */
export const getAllCategories = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const onlyActive =
      req.query.includeInactive === 'true'
        ? false
        : req.query.onlyActive !== 'false';

    const categories = await CategoryService.getAllCategories(onlyActive);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  }
);

/**
 * Get category by its unique slug
 * GET /api/categories/:slug
 */
export const getCategoryBySlug = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const rawSlug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    if (!rawSlug || typeof rawSlug !== 'string' || rawSlug.trim() === '') {
      throw new AppError(400, 'Category slug parameter is required');
    }

    const category = await CategoryService.getCategoryBySlug(rawSlug.trim());

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Category retrieved successfully',
      data: category,
    });
  }
);

/**
 * Get category by its unique UUID
 * GET /api/categories/id/:id
 */
export const getCategoryById = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = validateUUID(req.params.id);
    const category = await CategoryService.getCategoryById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Category retrieved successfully',
      data: category,
    });
  }
);

/**
 * Create a new category
 * POST /api/categories
 */
export const createCategory = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, slug, icon, description, isActive, order } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new AppError(
        400,
        'Category name is required and must be a non-empty string'
      );
    }

    const category = await CategoryService.createCategory({
      name: name.trim(),
      slug: slug ? String(slug).trim() : undefined,
      icon: icon ? String(icon).trim() : undefined,
      description: description ? String(description).trim() : undefined,
      isActive: typeof isActive === 'boolean' ? isActive : undefined,
      order: typeof order === 'number' ? order : undefined,
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  }
);

/**
 * Update an existing category
 * PATCH /api/categories/:id
 */
export const updateCategory = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = validateUUID(req.params.id);
    const { name, slug, icon, description, isActive, order } = req.body;

    const updatedCategory = await CategoryService.updateCategory(id, {
      name:
        typeof name === 'string' && name.trim() !== ''
          ? name.trim()
          : undefined,
      slug:
        typeof slug === 'string' && slug.trim() !== ''
          ? slug.trim()
          : undefined,
      icon:
        typeof icon === 'string'
          ? icon.trim()
          : icon === null
          ? null
          : undefined,
      description:
        typeof description === 'string'
          ? description.trim()
          : description === null
          ? null
          : undefined,
      isActive: typeof isActive === 'boolean' ? isActive : undefined,
      order: typeof order === 'number' ? order : undefined,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  }
);

/**
 * Soft delete an existing category
 * DELETE /api/categories/:id
 */
export const deleteCategory = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = validateUUID(req.params.id);
    const deletedCategory = await CategoryService.deleteCategory(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Category soft-deleted successfully',
      data: deletedCategory,
    });
  }
);

export const CategoryController = {
  getAllCategories,
  getCategoryBySlug,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default CategoryController;
