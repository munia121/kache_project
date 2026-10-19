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
  category?: string;
  categoryId?: string;
  condition?: ProductCondition | string;
  isNegotiable?: boolean | string;
  status?: ProductStatus | 'ALL' | string;
  minPrice?: number | string;
  maxPrice?: number | string;
  sortBy?: 'createdAt' | 'price' | 'viewsCount' | string;
  sortOrder?: 'asc' | 'desc' | string;
  location?: string;
  sellerId?: string;
}

export interface IProductCategoryRelation {
  id: string;
  name: string;
  slug: string;
}

export interface IProductSellerRelation {
  id: string;
  fullName: string;
  phone: string;
  avatar: string | null;
}

export type IProductWithRelations = Product & {
  category: IProductCategoryRelation | null;
  seller: IProductSellerRelation;
};

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IProductQueryResult<T = any> {
  meta: IPaginationMeta;
  data: T[];
}

export interface IToggleFavoriteResult {
  isFavorited: boolean;
  productId: string;
}

export interface IFavoriteProductFilterOptions {
  page?: number | string;
  limit?: number | string;
}
