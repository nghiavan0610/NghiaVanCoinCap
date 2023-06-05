import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PasswordMiddleware {
    constructor(private readonly prisma: PrismaService) {}

    async hashPassword(password: string): Promise<string> {
        return await hash(password);
    }

    async compare(storedPass: string, providedPass: string): Promise<boolean> {
        return await verify(storedPass, providedPass);
    }

    async hashRefreshToken(userId: string, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await hash(refreshToken);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshToken: hashedRefreshToken,
            },
        });
    }
}
