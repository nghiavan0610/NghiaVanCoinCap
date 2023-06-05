import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RefreshTokenPayload } from '../auth/interfaces/jwtPayload.interface';

export const GetCurrentUser = createParamDecorator(
    (data: keyof RefreshTokenPayload | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();

        if (!data) return request.user;

        return request.user[data];
    },
);
