import { Category } from '@prisma/client';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from './category.interface';


/**
- Utility function to generate a URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0980-\u09FF-]/g, '') // বাংলা অক্ষর অক্ষুণ্ণ রাখবে
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Ensures generated slug is unique in the categories table
 */
const getUniqueSlug = async (
  baseText: string,
  currentCategoryId?: string
): Promise<string> => {
  const baseSlug = generateSlug(baseText) || `category-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (!existing || (currentCategoryId && existing.id === currentCategoryId)) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

/**
 * Fetch all categories with optional active status filter, ordered by 'order' ascending
 */
export const getAllCategories = async (
  onlyActive: boolean = true
): Promise<Category[]> => {
  return await prisma.category.findMany({
    where: onlyActive ? { isActive: true } : undefined,
    orderBy: {
      order: 'asc',
    },
  });
};

/**
 * Fetch category details by its unique slug
 */
export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    throw new AppError(404, `Category with slug '${slug}' not found`);
  }

  return category;
};

/**
 * Fetch category details by its UUID string
 */
export const getCategoryById = async (id: string): Promise<Category> => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError(404, `Category with id '${id}' not found`);
  }

  return category;
};

/**
 * Create a new category with auto-generated or custom slug
 */
export const createCategory = async (
  data: ICreateCategoryPayload
): Promise<Category> => {
  let slug: string;

  if (data.slug && data.slug.trim() !== '') {
    const formattedSlug = generateSlug(data.slug);
    const existing = await prisma.category.findUnique({
      where: { slug: formattedSlug },
    });

    if (existing) {
      throw new AppError(
        409,
        `Category with slug '${formattedSlug}' already exists`
      );
    }

    slug = formattedSlug;
  } else {
    slug = await getUniqueSlug(data.name);
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug,
      icon: data.icon ?? null,
      description: data.description ?? null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      order: data.order !== undefined ? data.order : 0,
    },
  });

  return category;
};

/**
 * Update an existing category by its UUID
 */
export const updateCategory = async (
  id: string,
  data: IUpdateCategoryPayload
): Promise<Category> => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new AppError(404, `Category with id '${id}' not found`);
  }

  let slug: string | undefined = undefined;

  if (data.slug && data.slug.trim() !== '') {
    const formattedSlug = generateSlug(data.slug);
    const existingWithSlug = await prisma.category.findUnique({
      where: { slug: formattedSlug },
    });

    if (existingWithSlug && existingWithSlug.id !== id) {
      throw new AppError(
        409,
        `Category with slug '${formattedSlug}' already exists`
      );
    }

    slug = formattedSlug;
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(slug !== undefined && { slug }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.order !== undefined && { order: data.order }),
    },
  });

  return updatedCategory;
};

/**
 * Soft delete category by setting isActive to false
 */
export const deleteCategory = async (id: string): Promise<Category> => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new AppError(404, `Category with id '${id}' not found`);
  }

  const softDeletedCategory = await prisma.category.update({
    where: { id },
    data: {
      isActive: false,
    },
  });

  return softDeletedCategory;
};

export const CategoryService = {
  getAllCategories,
  getCategoryBySlug,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default CategoryService;
