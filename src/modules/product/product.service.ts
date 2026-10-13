import { Product, ProductCondition, ProductStatus, Prisma } from '@prisma/client';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import {
  ICreateProductPayload,
  IUpdateProductPayload,
  IProductFilterOptions,
  IProductQueryResult,
} from './product.interface';

/**
 * Utility function to generate a URL-friendly slug supporting both English and Bengali characters
 */
export const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0980-\u09FF-]/g, '') // preserves Bengali characters and alphanumeric
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Ensures generated slug is unique in the products table by appending an incremental counter
 */
export const getUniqueProductSlug = async (
  baseText: string,
  currentProductId?: string
): Promise<string> => {
  const baseSlug = generateSlug(baseText) || `product-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug },
    });

    if (!existing || (currentProductId && existing.id === currentProductId)) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

/**
 * Create a new product listing
 */
export const createProduct = async (
  sellerId: string,
  payload: ICreateProductPayload
): Promise<Product> => {
  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });
    if (!category) {
      throw new AppError(404, `Category with id '${payload.categoryId}' not found`);
    }
  }

  const priceDecimal = new Prisma.Decimal(payload.price);
  if (priceDecimal.isNegative()) {
    throw new AppError(400, 'Price must be a non-negative number');
  }

  const slug = await getUniqueProductSlug(payload.title);

  const product = await prisma.product.create({
    data: {
      title: payload.title.trim(),
      slug,
      description: payload.description.trim(),
      price: priceDecimal,
      isNegotiable: payload.isNegotiable ?? false,
      condition: payload.condition ?? ProductCondition.USED,
      status: payload.status ?? ProductStatus.AVAILABLE,
      images: payload.images ?? [],
      location: payload.location ? payload.location.trim() : null,
      sellerId,
      categoryId: payload.categoryId || null,
    },
    include: {
      seller: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          avatar: true,
          area: true,
        },
      },
      category: true,
    },
  });

  return product;
};

/**
 * Get all products with search, filtering, and pagination
 */
export const getAllProducts = async (
  filters: IProductFilterOptions = {}
): Promise<IProductQueryResult> => {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(filters.limit) || 10));
  const skip = (page - 1) * limit;

  const whereConditions: Prisma.ProductWhereInput[] = [];

  // Search by title or description
  const searchTerm = filters.searchTerm || filters.search;
  if (searchTerm && searchTerm.trim() !== '') {
    const term = searchTerm.trim();
    whereConditions.push({
      OR: [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ],
    });
  }

  // Filter by category
  if (filters.categoryId && filters.categoryId.trim() !== '') {
    whereConditions.push({ categoryId: filters.categoryId.trim() });
  }

  // Filter by condition
  if (filters.condition) {
    whereConditions.push({ condition: filters.condition });
  }

  // Filter by status (defaults to AVAILABLE for public browsing if not provided)
  if (filters.status) {
    if (filters.status !== 'ALL') {
      whereConditions.push({ status: filters.status });
    }
  } else {
    whereConditions.push({ status: ProductStatus.AVAILABLE });
  }

  // Filter by location
  if (filters.location && filters.location.trim() !== '') {
    whereConditions.push({
      location: { contains: filters.location.trim(), mode: 'insensitive' },
    });
  }

  // Filter by price range
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const priceFilter: Prisma.DecimalFilter = {};
    if (filters.minPrice !== undefined && filters.minPrice !== '') {
      priceFilter.gte = new Prisma.Decimal(filters.minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
      priceFilter.lte = new Prisma.Decimal(filters.maxPrice);
    }
    if (priceFilter.gte !== undefined || priceFilter.lte !== undefined) {
      whereConditions.push({ price: priceFilter });
    }
  }

  const where: Prisma.ProductWhereInput =
    whereConditions.length > 0 ? { AND: whereConditions } : {};

  // Sort configuration
  const validSortFields = ['createdAt', 'price', 'viewsCount', 'title'];
  const sortBy = validSortFields.includes(filters.sortBy as string)
    ? (filters.sortBy as string)
    : 'createdAt';
  const sortOrder: Prisma.SortOrder = filters.sortOrder === 'asc' ? 'asc' : 'desc';

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            avatar: true,
            area: true,
          },
        },
        category: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: products,
  };
};

/**
 * Fetch product details by slug and increment viewsCount
 */
export const getProductBySlug = async (slug: string): Promise<Product> => {
  const existingProduct = await prisma.product.findUnique({
    where: { slug },
  });

  if (!existingProduct) {
    throw new AppError(404, `Product with slug '${slug}' not found`);
  }

  const product = await prisma.product.update({
    where: { id: existingProduct.id },
    data: {
      viewsCount: {
        increment: 1,
      },
    },
    include: {
      seller: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          avatar: true,
          area: true,
          address: true,
        },
      },
      category: true,
    },
  });

  return product;
};

/**
 * Fetch product details by UUID string
 */
export const getProductById = async (id: string): Promise<Product> => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      seller: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          avatar: true,
          area: true,
          address: true,
        },
      },
      category: true,
    },
  });

  if (!product) {
    throw new AppError(404, `Product with id '${id}' not found`);
  }

  return product;
};

/**
 * Update an existing product listing
 */
export const updateProduct = async (
  id: string,
  payload: IUpdateProductPayload
): Promise<Product> => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new AppError(404, `Product with id '${id}' not found`);
  }

  if (payload.categoryId !== undefined && payload.categoryId !== null) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });
    if (!category) {
      throw new AppError(404, `Category with id '${payload.categoryId}' not found`);
    }
  }

  let newSlug: string | undefined = undefined;
  if (
    payload.title !== undefined &&
    payload.title.trim() !== '' &&
    payload.title.trim() !== existingProduct.title
  ) {
    newSlug = await getUniqueProductSlug(payload.title.trim(), id);
  }

  let priceDecimal: Prisma.Decimal | undefined = undefined;
  if (payload.price !== undefined) {
    priceDecimal = new Prisma.Decimal(payload.price);
    if (priceDecimal.isNegative()) {
      throw new AppError(400, 'Price must be a non-negative number');
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...(payload.title !== undefined && { title: payload.title.trim() }),
      ...(newSlug !== undefined && { slug: newSlug }),
      ...(payload.description !== undefined && { description: payload.description.trim() }),
      ...(priceDecimal !== undefined && { price: priceDecimal }),
      ...(payload.isNegotiable !== undefined && { isNegotiable: payload.isNegotiable }),
      ...(payload.condition !== undefined && { condition: payload.condition }),
      ...(payload.status !== undefined && { status: payload.status }),
      ...(payload.images !== undefined && { images: payload.images }),
      ...(payload.location !== undefined && {
        location: payload.location ? payload.location.trim() : null,
      }),
      ...(payload.categoryId !== undefined && { categoryId: payload.categoryId }),
    },
    include: {
      seller: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          avatar: true,
          area: true,
        },
      },
      category: true,
    },
  });

  return updatedProduct;
};

/**
 * Remove or archive product listing
 */
export const deleteProduct = async (
  id: string,
  permanent: boolean = false
): Promise<Product> => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new AppError(404, `Product with id '${id}' not found`);
  }

  if (permanent) {
    return await prisma.product.delete({
      where: { id },
    });
  }

  return await prisma.product.update({
    where: { id },
    data: {
      status: ProductStatus.ARCHIVED,
    },
  });
};

/**
 * Fetch listings belonging to the authenticated user
 */
export const getMyProducts = async (
  sellerId: string,
  filters: IProductFilterOptions = {}
): Promise<IProductQueryResult> => {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(filters.limit) || 10));
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {
    sellerId,
    ...(filters.status &&
      filters.status !== 'ALL' && { status: filters.status }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: products,
  };
};

export const ProductService = {
  generateSlug,
  getUniqueProductSlug,
  createProduct,
  getAllProducts,
  getProductBySlug,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
};

export default ProductService;
