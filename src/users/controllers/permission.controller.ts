import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { RequirePermissions } from '../guards/permission.guard';
import { PermissionService } from '../services/permission.service';
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

  @Post('role/grant/:roleId/:permissionName')
  grantToRole(
    @Param('roleId') roleId: string,
    @Param('permissionName') permissionName: string,
  ) {
    return this.permissionService.grantPermissionToRole(roleId, permissionName);
  }

  @Post('role/revoke/:roleId/:permissionName')
  revokeFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionName') permissionName: string,
  ) {
    return this.permissionService.revokePermissionFromRole(roleId, permissionName);
  }

  @Post()
  create(@Body() createPermissionDto: { name: string; description: string }) {
    return this.permissionService.createPermission(
      createPermissionDto.name,
      createPermissionDto.description,
    );
  }
} 