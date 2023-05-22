import { seedUsers } from './seeders/user.seed';
// import { seedWallets } from './seeders/wallet.seed';

(async function seed() {
    try {
        await seedUsers();
        // await seedWallets();

        console.log('[ADDED] All seed data has been added to database');
    } catch (err) {
        console.error(err);
    }
})();
