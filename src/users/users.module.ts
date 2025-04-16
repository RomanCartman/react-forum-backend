import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UsersController } from './users.controller';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
  ],
  controllers: [UsersController, RoleController, PermissionController],
  providers: [UsersService, RoleService, PermissionService],
  exports: [UsersService, RoleService, PermissionService],
})
export class UsersModule {} 