import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../services/permission.service';

export const RequirePermissions = (...permissions: string[]) => SetMetadata('permissions', permissions);

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
    
    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;

    if (!userId) {
      return false;
    }

    const hasAllPermissions = await Promise.all(
      permissions.map(permission => this.permissionService.hasPermission(userId, permission))
    );

    return hasAllPermissions.every(Boolean);
  }
} 