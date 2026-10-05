import { Product, ProductImage, Prisma } from '@prisma/client';

export type IProduct = Product;
export type IProductImage = ProductImage;
export type IProductCreate = Prisma.ProductCreateInput;
export type IProductUpdate = Prisma.ProductUpdateInput;
