import { Order, Transaction, Wallet } from '@prisma/client';

export interface UserData {
    id: string;
    username: string;
    fullname: string;
    email?: string;
    avatar?: string;
    phone?: string;
    birthday?: Date;
    gender?: string;
    about?: string;
    cash?: number;
    wallets?: Wallet[];
    orders?: Order[];
    transactions?: Transaction[];
}

export interface UsersPayload {
    users: UserData[];
}

export interface SingleUserPayload {
    user: UserData;
}
