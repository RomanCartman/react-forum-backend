import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { RequirePermissions } from '../guards/permission.guard';
import { PermissionService } from '../services/permission.service';
import { Role } from '../enums/role.enum';
import { PermissionName } from '../enums/permission.enum';

@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermissions(PermissionName.MANAGE_PERMISSIONS)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('grant/:userId/:permissionName')
  grantToUser(
    @Param('userId') userId: string,
    @Param('permissionName') permissionName: string,
  ) {
    return this.permissionService.grantPermissionToUser(userId, permissionName);
  }

  @Post('revoke/:userId/:permissionName')
  revokeFromUser(
    @Param('userId') userId: string,
    @Param('permissionName') permissionName: string,
  ) {
    return this.permissionService.revokePermissionFromUser(userId, permissionName);
  }

  @Post('role/add/:permissionName/:role')
  addToRole(
    @Param('permissionName') permissionName: string,
    @Param('role') role: Role,
  ) {
    return this.permissionService.addPermissionToRole(permissionName, role);
  }

  @Post('role/remove/:permissionName/:role')
  removeFromRole(
    @Param('permissionName') permissionName: string,
    @Param('role') role: Role,
  ) {
    return this.permissionService.removePermissionFromRole(permissionName, role);
  }
} 