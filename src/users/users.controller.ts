import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from './services/role.service';
import { PermissionGuard, RequirePermissions } from './guards/permission.guard';
import { PermissionName } from './enums/permission.enum';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(PermissionName.MANAGE_USERS)
  async findAll(@Query('role') role?: RoleName) {
    if (role) {
      return this.usersService.findByRole(role);
    }
    return this.usersService.findAll();
  }
} 