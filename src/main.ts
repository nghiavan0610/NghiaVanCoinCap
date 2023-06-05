import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ErrorHandler } from './exception-handler/exception-handler.filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import rawBodyMiddleware from './payment/middlewares/rawBody.middleware';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
    // app.useLogger(new Logger());
    // app.use(morgan('combined'));

    app.use(helmet());

    app.setGlobalPrefix(`api`);

    const config = app.get<ConfigService>(ConfigService);

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorHandler(config));

    app.use(rawBodyMiddleware());

    // swagger
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Crypto Currency Market Api')
        .setDescription('Building a Crypto Currency Market with NestJS and Prisma')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document);

    await app.listen(config.get('NODE_DOCKER_PORT') || 8000, async () => {
        console.log(`App listening on port ${config.get('NODE_DOCKER_PORT') || 8000}`);
    });
}
bootstrap();
