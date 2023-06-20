import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ExecuteTransactionDto } from './dto/executeTransaction.dto';
import { TransactionService } from './transaction.service';
import { CoinsService } from './coins.service';

@Injectable()
export class CoinsSchedule implements OnModuleInit {
    constructor(private transactionService: TransactionService, private coinsService: CoinsService) {}

    groupBy(array, key) {
        return array.reduce((result, item) => {
            (result[item[key]] = result[item[key]] || []).push(item);
            return result;
        }, {});
    }

    onModuleInit() {
        this.executeTransactions();
    }

    @Cron('*/500 * * * * *') // Run every 5 seconds
    async executeTransactions() {
        const pendingTransactions = await this.transactionService.getPendingTransactions();
        console.log('pending-transactions: ', pendingTransactions.length);

        const transactionGroups = this.groupBy(pendingTransactions, 'coinId');

        for (const coinId in transactionGroups) {
            const realTimePrice = await this.coinsService.getRealTimePrice(coinId);
            console.log(`${coinId}: ${realTimePrice}`);

            const transactions = transactionGroups[coinId];
            for (const transaction of transactions) {
                const { id, userId, type, price, amount } = transaction;

                if ((type === 'bid' && realTimePrice <= price) || (type === 'ask' && realTimePrice >= price)) {
                    console.log(
                        `[Execute]: ${transaction.id} - [user]:${transaction.userId} - [${transaction.type}] - [${transaction.coinId}] - [price]:${transaction.price} - [amount]:${transaction.amount}`,
                    );
                    const executeTransactionDto: ExecuteTransactionDto = {
                        id,
                        userId,
                        coinId,
                        type,
                        realTimePrice,
                        amount,
                    };
                    await this.transactionService.executeTransaction(executeTransactionDto);
                }
            }
        }
    }
}
