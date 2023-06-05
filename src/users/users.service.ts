/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserData } from './interfaces/user.interface';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { PasswordMiddleware } from 'src/auth/middlewares/password.middleware';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService, private passwordMiddleware: PasswordMiddleware) {}

    async getAllUsers(): Promise<UserData[]> {
        const users = await this.prisma.user.findMany({
            select: { id: true, username: true, fullname: true, email: true, avatar: true },
        });
        return users;
    }

    async getUser(id: string): Promise<UserData> {
        const { password, refreshToken, ...user } = await this.prisma.user.findUnique({
            where: { id },
            include: { wallets: true },
        });
        if (!user) throw new NotFoundException(`User was not found: ${id}.`);
        return user;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserData> {
        const { password, refreshToken, ...user } = await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
        return user;
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<UserData> {
        const { oldPassword, newPassword, confirmPassword } = changePasswordDto;
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user) throw new NotFoundException(`User was not found: ${id}.`);

        const passwordMatch = await this.passwordMiddleware.compare(user.password, oldPassword);
        if (!passwordMatch) throw new UnauthorizedException('Your password is incorrect');

        if (newPassword !== confirmPassword) throw new NotAcceptableException('Confirm password is incorrect');

        const hashedPassword = await this.passwordMiddleware.hashPassword(confirmPassword);
        const { password, refreshToken, ...updatedUser } = await this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword, refreshToken: null },
        });
        return updatedUser;
    }

    async removeUser(id: string) {
        await this.prisma.user.delete({ where: { id } });
    }
}
