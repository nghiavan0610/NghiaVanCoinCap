import { Module } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { CoinsSchedule } from './coins.schedule';
import { UsersService } from 'src/users/users.service';
import { TransactionService } from './transaction.service';
import { PasswordMiddleware } from 'src/auth/middlewares/password.middleware';

@Module({
    imports: [ScheduleModule.forRoot()],
    controllers: [CoinsController],
    providers: [CoinsService, CoinsSchedule, TransactionService, UsersService, PasswordMiddleware],
})
export class CoinsModule {}
