import { Transaction } from '@prisma/client';
// import { UserData } from 'src/users/interfaces/user.interface';

// export interface TransactionData {
//     type: string;
//     coinId: string;
//     price: number;
//     amount: number;
//     user: UserData;
// }

export interface TransactionsPayload {
    transactions: Transaction[];
}

export interface SingTransactionPayload {
    transaction: Transaction;
}
