import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';
// import { prismaHashMiddleware } from 'src/middlewares/prisma.hash';
import { prismaLoggingMiddleware } from 'src/middlewares/prisma.logging';
// import { prismaSlugMiddleware } from 'src/middlewares/prisma.slug';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions> implements OnModuleInit {
    constructor(config: ConfigService) {
        const url = config.get<string>('DATABASE_URL');
        super({
            datasources: {
                db: {
                    url,
                },
            },
        });
        // this.$use(prismaHashMiddleware());
        // this.$use(prismaSlugMiddleware());
        this.$use(prismaLoggingMiddleware());
    }

    async onModuleInit(): Promise<void> {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
}
