import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

const seedUsers = async () => {
    try {
        const userData = [];
        for (let i = 0; i < 15; i++) {
            userData.push({
                username: i === 0 ? 'admin' : `user${i + 1}`,
                fullname: i === 0 ? 'admin' : `user${i + 1}`,
                email: i === 0 ? 'admin@gmail.com' : `user${i + 1}@gmail.com`,
                password: i === 0 ? await hash('p@ssword') : await hash(`user${i + 1}password`),
                cash: Math.random() < 0.5 ? Math.floor(Math.random() * (999999 - 1 + 1) + 1) : 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: i === 0 ? 'Admin' : 'User',
                // slug: i === 0 ? 'admin' : `user${i + 1}`,
            });
        }

        await prisma.user.createMany({ data: userData });
        console.log(`Users data has been added to database`);
    } catch (err) {
        throw err;
    } finally {
        await prisma.$disconnect();
    }
};

export { seedUsers };
