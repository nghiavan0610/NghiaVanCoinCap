import { TokenMiddleware } from './middlewares/token.middleware';
import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegistrationDto } from './dto/registration.dto';
import { Prisma } from '@prisma/client';
import { LoginPayload } from './interfaces/loginPayload.interface';
import { CredentialDto } from './dto/credential.dto';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import { PasswordMiddleware } from './middlewares/password.middleware';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private passwordMiddleware: PasswordMiddleware,
        private tokenMiddleware: TokenMiddleware,
    ) {}

    async signUp(registration: RegistrationDto): Promise<LoginPayload> {
        try {
            const hashedPassword = await this.passwordMiddleware.hashPassword(registration.password);
            const user = await this.prisma.user.create({
                data: { ...registration, password: hashedPassword },
            });

            const { accessToken, refreshToken } = await this.tokenMiddleware.createTokens(user.id, user.role);
            await this.passwordMiddleware.hashRefreshToken(user.id, refreshToken);

            return {
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    username: user.username,
                    fullname: user.fullname,
                    avatar: user.avatar,
                },
            };
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new ConflictException('This username is already exsist');
            }
            throw err;
        }
    }

    async signIn(credentials: CredentialDto): Promise<LoginPayload> {
        const user = await this.prisma.user.findUnique({
            where: { username: credentials.username },
            select: { id: true, username: true, password: true, avatar: true, fullname: true, role: true },
        });

        if (!user) throw new UnauthorizedException('Invalid username or password');

        const passwordMatch = await this.passwordMiddleware.compare(user.password, credentials.password);
        if (!passwordMatch) throw new UnauthorizedException('Invalid username or password');

        const { accessToken, refreshToken } = await this.tokenMiddleware.createTokens(user.id, user.role);
        await this.passwordMiddleware.hashRefreshToken(user.id, refreshToken);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userPayload } = user;
        return { accessToken, refreshToken, user: userPayload };
    }

    async signOut(userId: string): Promise<boolean> {
        await this.prisma.user.updateMany({
            where: { id: userId, refreshToken: { not: null } },
            data: { refreshToken: null },
        });
        return true;
    }

    async refreshToken(userId: string, refreshToken: string): Promise<TokenPayload> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.refreshToken) throw new ForbiddenException('Refresh Token has been revoked');

        const refreshTokenMatch = await this.passwordMiddleware.compare(user.refreshToken, refreshToken);
        if (!refreshTokenMatch) throw new ForbiddenException('Refresh Token has been revoked');

        const tokens = await this.tokenMiddleware.createTokens(user.id, user.username);
        await this.passwordMiddleware.hashRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }
}
