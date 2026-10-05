import { User, Role, Prisma } from '@prisma/client';

export type IUser = User;
export { Role };
export type IUserCreate = Prisma.UserCreateInput;
export type IUserUpdate = Prisma.UserUpdateInput;
