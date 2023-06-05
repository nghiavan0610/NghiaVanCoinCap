import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { TransactionData } from './interfaces/transaction.interface';
import { ExecuteTransactionDto } from './dto/executeTransaction.dto';

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService, private usersService: UsersService) {}

    async createTransaction(
        id: string,
        coinId: string,
        createTransactionDto: CreateTransactionDto,
    ): Promise<TransactionData> {
        const transaction = await this.prisma.transaction.create({
            data: { userId: id, coinId, ...createTransactionDto },
            include: { user: { select: { id: true, username: true, fullname: true } } },
        });
        return transaction;
    }

    async deleteTransaction(id: string, transactionId: string): Promise<boolean> {
        const { count } = await this.prisma.transaction.deleteMany({ where: { id: transactionId, userId: id } });
        if (count === 0) throw new ConflictException('Transaction not found or not your transaction');
        return null;
    }

    async executeTransaction(executeTransactionDto: ExecuteTransactionDto): Promise<void> {
        const { id, userId, coinId, type, realTimePrice, amount } = executeTransactionDto;
        const [user, wallet] = await Promise.all([
            this.usersService.getUser(userId),
            this.prisma.wallet.findFirst({ where: { userId, coinId } }),
        ]);

        const totalAmount = realTimePrice * amount;

        try {
            switch (type) {
                case 'bid':
                    if (user?.cash < totalAmount) throw new BadRequestException('Insufficient funds');

                    await Promise.all([
                        this.prisma.user.update({
                            where: { id: userId },
                            data: { cash: user.cash - totalAmount },
                        }),
                        wallet
                            ? this.prisma.wallet.update({
                                  where: { id: wallet.id },
                                  data: { balance: wallet.balance + amount },
                              })
                            : this.prisma.wallet.create({
                                  data: { userId, coinId, balance: amount },
                              }),
                    ]);
                    break;
                case 'ask':
                    if (!wallet) throw new NotFoundException('Wallet was not found');
                    if (wallet.balance < amount) throw new BadRequestException('Insufficient coins');

                    await Promise.all([
                        this.prisma.user.update({
                            where: { id: userId },
                            data: { cash: user.cash + totalAmount },
                        }),
                        this.prisma.wallet.update({
                            where: { id: wallet.id },
                            data: { balance: wallet.balance - amount },
                        }),
                    ]);
                    break;
                default:
                    throw new NotFoundException('Unknow transaction type');
            }
        } catch (err) {
            await this.prisma.transaction.delete({ where: { id } });
            throw err;
        }

        await this.prisma.transaction.delete({ where: { id } });
    }

    async getPendingTransactions(): Promise<any[]> {
        return await this.prisma.transaction.findMany();
    }
}
