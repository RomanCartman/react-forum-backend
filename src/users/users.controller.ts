import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard, RequirePermissions } from './guards/permission.guard';
import { RoleName } from './services/role.service';
import { PermissionName } from './enums/permission.enum';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions(PermissionName.MANAGE_USERS)
  async findAll(@Query('role') role?: RoleName) {
    if (role) {
      return this.usersService.findByRole(role);
    }
    return this.usersService.findAll();
  }
} 