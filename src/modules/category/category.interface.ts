import { Category, Prisma } from '@prisma/client';

export type ICategory = Category;
export type ICategoryCreate = Prisma.CategoryCreateInput;
export type ICategoryUpdate = Prisma.CategoryUpdateInput;

export interface ICreateCategoryPayload {
  name: string;
  slug?: string;
  icon?: string | null;
  description?: string | null;
  isActive?: boolean;
  order?: number;
}

export interface IUpdateCategoryPayload {
  name?: string;
  slug?: string;
  icon?: string | null;
  description?: string | null;
  isActive?: boolean;
  order?: number;
}

export interface ICategoryFilterOptions {
  onlyActive?: boolean;
}
