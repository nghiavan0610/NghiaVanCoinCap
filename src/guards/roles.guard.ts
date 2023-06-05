// admin.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const userRole = request.user.role;
        if (!requiredRoles.includes(userRole)) {
            throw new ForbiddenException('Access denied. You do not have the required role.');
        }
        return true;
    }
}
