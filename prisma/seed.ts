import { seedUsers } from './seeders/user.seed';
import { seedTransactions } from './seeders/transaction.seed';

(async function seed() {
    try {
        await seedUsers();
        await seedTransactions();
        // await seedWallets();

        console.log('[ADDED] All seed data has been added to database');
    } catch (err) {
        console.error(err);
    }
})();
