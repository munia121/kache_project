import { z } from 'zod';
import { ProductCondition, ProductStatus } from '@prisma/client';

export const createProductZodSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).min(1, 'Title cannot be empty'),
  description: z.string({ required_error: 'Description is required' }).min(1, 'Description cannot be empty'),
  price: z.number({ required_error: 'Price is required' }).nonnegative('Price must be a non-negative number'),
  isNegotiable: z.boolean().optional(),
  condition: z.nativeEnum(ProductCondition).optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  images: z.array(z.string()).optional(),
  location: z.string().optional().nullable(),
  categoryId: z.string().uuid({ message: 'Invalid Category ID format' }).optional().nullable(),
  areaId: z.string().uuid({ message: 'Invalid Area ID format' }).optional(),
});

export const updateProductZodSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').optional(),
  description: z.string().min(1, 'Description cannot be empty').optional(),
  price: z.number().nonnegative('Price must be a non-negative number').optional(),
  isNegotiable: z.boolean().optional(),
  condition: z.nativeEnum(ProductCondition).optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  images: z.array(z.string()).optional(),
  location: z.string().optional().nullable(),
  categoryId: z.string().uuid({ message: 'Invalid Category ID format' }).optional().nullable(),
  areaId: z.string().uuid({ message: 'Invalid Area ID format' }).optional(),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
};

export default ProductValidation;
