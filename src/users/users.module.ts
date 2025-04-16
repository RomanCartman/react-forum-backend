import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Permission } from './entities/permission.entity';
import { PermissionService } from './services/permission.service';
import { PermissionController } from './controllers/permission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Permission])],
  controllers: [UsersController, PermissionController],
  providers: [UsersService, PermissionService],
  exports: [UsersService, PermissionService],
})
export class UsersModule {} 