import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordMiddleware } from 'src/auth/middlewares/password.middleware';

@Module({
    controllers: [UsersController],
    providers: [UsersService, PasswordMiddleware],
    // imports: [PrismaModule],
})
export class UsersModule {}
