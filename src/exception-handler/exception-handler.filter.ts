import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class ErrorHandler extends BaseExceptionFilter {
    constructor(private config: ConfigService) {
        super();
    }

    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const message = exception.message.replace(/\n/g, '');
        const stack = this.config.get<string>('NODE_ENV') !== 'production' ? null : exception.stack;

        switch (exception.code) {
            case 'P2002':
            case 'P2026':
                response.status(HttpStatus.CONFLICT).json({
                    success: false,
                    name: 'Unique constraint violation',
                    message: message,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    stack,
                });
                break;
            case 'P2016':
            case 'P2003':
                response.status(HttpStatus.CONFLICT).json({
                    success: false,
                    name: 'Foreign key constraint violation',
                    message: message,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    stack,
                });
                break;
            case 'P2025':
                response.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    name: 'Record not found ',
                    message: message,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    stack,
                });
                break;
            case 'P2014':
                response.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    name: 'Check constraint violation',
                    message: message,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    stack,
                });
                break;
            case 'P2006':
                response.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    name: 'Null constraint violation',
                    message: message,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    stack,
                });
                break;
            default:
                super.catch(exception, host);
                break;
        }
    }
}
