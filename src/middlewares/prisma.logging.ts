import { Prisma } from '@prisma/client';

export function prismaLoggingMiddleware<T extends Prisma.BatchPayload = Prisma.BatchPayload>(): Prisma.Middleware {
    return async (
        params: Prisma.MiddlewareParams,
        next: (params: Prisma.MiddlewareParams) => Promise<T>,
    ): Promise<T> => {
        const before = Date.now();

        const result = await next(params);

        const after = Date.now();

        console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

        return result;
    };
}
