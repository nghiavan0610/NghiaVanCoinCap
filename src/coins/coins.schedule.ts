import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ExecuteTransactionDto } from './dto/executeTransaction.dto';
import { TransactionService } from './transaction.service';
import { CoinsService } from './coins.service';

@Injectable()
export class CoinsSchedule implements OnModuleInit {
    constructor(private transactionService: TransactionService, private coinsService: CoinsService) {}

    onModuleInit() {
        this.executeTransactions();
    }

    @Cron('*/5 * * * * *') // Run every 5 seconds
    async executeTransactions() {
        const pendingTransactions = await this.transactionService.getPendingTransactions();
        console.log('pending-transactions: ', pendingTransactions.length);

        for (const transaction of pendingTransactions) {
            const { id, userId, coinId, type, price, amount } = transaction;

            const realTimePrice = await this.coinsService.getRealTimePrice(coinId);
            console.log(`${coinId}: ${realTimePrice}`);
            if ((type === 'bid' && realTimePrice <= price) || (type === 'ask' && realTimePrice >= price)) {
                console.log('execute');
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
