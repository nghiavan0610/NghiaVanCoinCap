import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedTransactions = async () => {
    try {
        const users = await prisma.user.findMany();

        const popularCoins = [
            'bitcoin',
            'ethereum',
            'cardano',
            'stellar',
            'binancecoin',
            'dogecoin',
            'litecoin',
            'polkadot',
        ];

        const transactionData = [];
        for (let i = 0; i < 20; i++) {
            transactionData.push({
                userId: users[(Math.random() * users.length) | 0].id,
                coinId: 'bitcoin',
                type: 'bid',
                price: Math.floor(Math.random() * (30000 - 1 + 1) + 1),
                amount: Math.floor(Math.random() * (10000 - 1 + 1) + 1),
                // status: 'pending' | 'cancel' | 'success'
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        for (let i = 0; i < 500; i++) {
            transactionData.push({
                userId: users[(Math.random() * users.length) | 0].id,
                coinId: popularCoins[(Math.random() * popularCoins.length) | 0],
                type: 'bid',
                price: Math.floor(Math.random() * (2 - 1 + 1) + 1),
                amount: Math.floor(Math.random() * (10000 - 1 + 1) + 1),
                // status: 'pending' | 'cancel' | 'success'
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        await prisma.transaction.createMany({ data: transactionData });
        console.log(`Transactions data has been added to database`);
    } catch (err) {
        throw err;
    } finally {
        await prisma.$disconnect();
    }
};

export { seedTransactions };
