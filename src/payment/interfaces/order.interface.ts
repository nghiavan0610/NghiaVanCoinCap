// export interface OrderData {
//     id: string;
//     userId: string;
//     customerId: string;
//     paymentIntentId: string;
//     product: string;
//     subTotal: number;
//     total: number;
//     paymentStatus: string;
//     createdAt: Date;
//     updatedAt: Date;
// }

import { Order } from '@prisma/client';

export interface OrdersPayload {
    orders: Order[];
}

export interface SingleOrderPayload {
    order: Order;
}
