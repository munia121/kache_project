import { Product, ProductCondition, ProductStatus, Prisma } from '@prisma/client';

export type IProduct = Product;

export interface ICreateProductPayload {
  title: string;
  description: string;
  price: number | string | Prisma.Decimal;
  isNegotiable?: boolean;
  condition?: ProductCondition;
  status?: ProductStatus;
  images?: string[];
  location?: string | null;
  categoryId?: string | null;
  replaceImages?: boolean;
}

export interface IUpdateProductPayload {
  title?: string;
  description?: string;
  price?: number | string | Prisma.Decimal;
  isNegotiable?: boolean;
  condition?: ProductCondition;
  status?: ProductStatus;
  images?: string[];
  location?: string | null;
  categoryId?: string | null;
  replaceImages?: boolean;
}

export interface IProductFilterOptions {
  page?: number | string;
  limit?: number | string;
  search?: string;
  searchTerm?: string;
  categoryId?: string;
  condition?: ProductCondition;
  status?: ProductStatus | 'ALL';
  minPrice?: number | string;
  maxPrice?: number | string;
  sortBy?: 'createdAt' | 'price' | 'viewsCount' | 'title';
  sortOrder?: 'asc' | 'desc';
  location?: string;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IProductQueryResult {
  meta: IPaginationMeta;
  data: Product[];
}
