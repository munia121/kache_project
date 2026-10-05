import { Order, OrderItem, OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

export type IOrder = Order;
export type IOrderItem = OrderItem;
export { OrderStatus, PaymentStatus };
export type IOrderCreate = Prisma.OrderCreateInput;
export type IOrderUpdate = Prisma.OrderUpdateInput;
