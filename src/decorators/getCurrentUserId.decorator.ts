import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AccessTokenPayload } from '../auth/interfaces/jwtPayload.interface';

export const GetCurrentUserId = createParamDecorator((_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AccessTokenPayload;
    return user.id;
});
