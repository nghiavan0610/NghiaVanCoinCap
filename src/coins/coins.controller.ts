import { Controller, Get, HttpCode, HttpStatus, Param, Query, Post, Body, Delete } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { SingTransactionPayload, TransactionsPayload } from './interfaces/transaction.interface';
import { TransactionService } from './transaction.service';
import { CoinsPayload, SingleCoinPayload } from './interfaces/coin.interface';

@Controller('coins')
@ApiTags('coins')
export class CoinsController {
    constructor(private readonly coinsService: CoinsService, private readonly transactionService: TransactionService) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    async getAllCoins(@Query('page') page: number): Promise<CoinsPayload> {
        const coins = await this.coinsService.getAllCoins(page);
        return { coins };
    }

    @Get(':coinId')
    @HttpCode(HttpStatus.OK)
    async getCoin(@Param('coinId') coinId: string): Promise<SingleCoinPayload> {
        const coin = await this.coinsService.getCoin(coinId);
        return { coin };
    }

    @Post(':coinId/transactions/create')
    @HttpCode(HttpStatus.CREATED)
    async createTransaction(
        @GetCurrentUserId() id: string,
        @Param('coinId') coinId: string,
        @Body() createTransactionDto: CreateTransactionDto,
    ): Promise<SingTransactionPayload> {
        const transaction = await this.transactionService.createTransaction(id, coinId, createTransactionDto);
        return { transaction };
    }

    @Get(':coinId/transactions')
    @HttpCode(HttpStatus.OK)
    async getCoinTransactions(
        @GetCurrentUserId() id: string,
        @Param('coinId') coinId: string,
    ): Promise<TransactionsPayload> {
        const transactions = await this.transactionService.getCoinTransactions(id, coinId);
        return { transactions };
    }

    @Delete(':coinId/transactions/:transactionId')
    @HttpCode(HttpStatus.OK)
    async deleteTransaction(
        @GetCurrentUserId() id: string,
        @Param('transactionId') transactionId: string,
    ): Promise<boolean> {
        return await this.transactionService.deleteTransaction(id, transactionId);
    }
}
