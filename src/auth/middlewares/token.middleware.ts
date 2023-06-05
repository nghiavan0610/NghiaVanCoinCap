import { Injectable } from '@nestjs/common';
import { TokenPayload } from '../interfaces/tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload } from '../interfaces/jwtPayload.interface';

@Injectable()
export class TokenMiddleware {
    constructor(private jwtService: JwtService, private config: ConfigService) {}

    async createTokens(userId: string, role: string): Promise<TokenPayload> {
        const jwtPayload: AccessTokenPayload = {
            id: userId,
            role,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
                expiresIn: this.config.get<number>('ACCESS_TOKEN_EXPIRE'),
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
                expiresIn: this.config.get<number>('REFRESH_TOKEN_EXPIRE'),
            }),
        ]);

        return { accessToken, refreshToken };
    }
}
