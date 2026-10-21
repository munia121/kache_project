import { z } from 'zod';
import { ProductStatus } from '@prisma/client';

/**
 * Zod validation schema for updating user profile
 * Accepts optional fields: fullName, avatar, areaId (UUID or null), address
 */
export const updateProfileZodSchema = z.object({
  fullName: z
    .string({ invalid_type_error: 'Full name must be a string' })
    .trim()
    .min(1, 'Full name cannot be empty')
    .max(150, 'Full name cannot exceed 150 characters')
    .optional(),
  avatar: z
    .string({ invalid_type_error: 'Avatar must be a string' })
    .trim()
    .optional()
    .nullable(),
  areaId: z
    .union([
      z.string().uuid({ message: 'Invalid Area ID format' }),
      z.null(),
      z.literal(''),
    ])
    .optional()
    .transform((val) => (val === '' ? null : val)),
  address: z
    .string({ invalid_type_error: 'Address must be a string' })
    .trim()
    .optional()
    .nullable(),
});

/**
 * Zod validation schema for password change
 * Validates oldPassword and newPassword (both min 6 chars)
 */
export const changePasswordZodSchema = z.object({
  oldPassword: z
    .string({ required_error: 'Current password (oldPassword) is required' })
    .min(6, 'Current password must be at least 6 characters long'),
  newPassword: z
    .string({ required_error: 'New password (newPassword) is required' })
    .min(6, 'New password must be at least 6 characters long'),
});

/**
 * Zod validation schema for querying user's listings
 */
export const myListingsQueryZodSchema = z.object({
  status: z
    .string()
    .trim()
    .toUpperCase()
    .refine(
      (val) => !val || Object.values(ProductStatus).includes(val as ProductStatus),
      {
        message: `Invalid product status. Allowed values: ${Object.values(ProductStatus).join(', ')}`,
      }
    )
    .optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export const UserValidation = {
  updateProfileZodSchema,
  changePasswordZodSchema,
  myListingsQueryZodSchema,
};

export default UserValidation;
