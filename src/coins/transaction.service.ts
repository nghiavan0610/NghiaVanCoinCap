import { ConflictException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { ExecuteTransactionDto } from './dto/executeTransaction.dto';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService, private usersService: UsersService) {}

    async getCoinTransactions(id: string, coinId: string): Promise<Transaction[]> {
        const transactions = await this.prisma.transaction.findMany({
            where: { coinId, userId: id },
            orderBy: { createdAt: 'desc' },
        });
        return transactions;
    }

    async createTransaction(
        id: string,
        coinId: string,
        createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction> {
        try {
            const { type, price, amount } = createTransactionDto;
            const total = price * amount;
            if (type === 'bid') {
                const user = await this.prisma.user.findFirst({
                    where: { id, cash: { gt: total } },
                });

                if (!user) throw new NotAcceptableException('Insufficient funds');
            }

            if (type === 'ask') {
                const wallet = await this.prisma.wallet.findFirst({
                    where: { userId: id, coinId, balance: { gt: amount } },
                });

                if (!wallet) throw new NotAcceptableException('Insufficient coins');
            }

            const transaction = await this.prisma.transaction.create({
                data: { userId: id, coinId, ...createTransactionDto },
                include: { user: { select: { id: true, username: true, fullname: true } } },
            });
            return transaction;
        } catch (err) {
            throw err;
        }
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

        switch (type) {
            case 'bid':
                if (user?.cash < totalAmount) {
                    await this.prisma.transaction.update({ where: { id }, data: { status: 'cancel' } });
                    break;
                }

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
                await this.prisma.transaction.update({ where: { id }, data: { status: 'success' } });

                break;
            case 'ask':
                if (!wallet || wallet.balance < amount) {
                    await this.prisma.transaction.update({ where: { id }, data: { status: 'cancel' } });
                    break;
                }

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
                await this.prisma.transaction.update({ where: { id }, data: { status: 'success' } });

                break;
            default:
                throw new NotFoundException('Unknow transaction type');
        }
    }

    async getPendingTransactions(): Promise<Transaction[]> {
        return await this.prisma.transaction.findMany({ where: { status: 'pending' } });
    }
}
