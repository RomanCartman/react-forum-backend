import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { PermissionName } from '../enums/permission.enum';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createPermission(name: string, description: string, allowedRoles: Role[] = []): Promise<Permission> {
    const permission = this.permissionRepository.create({
      name,
      description,
      allowedRoles,
    });
    return this.permissionRepository.save(permission);
  }

  async grantPermissionToUser(userId: string, permissionName: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['permissions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const permission = await this.permissionRepository.findOne({
      where: { name: permissionName },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    user.permissions = [...(user.permissions || []), permission];
    return this.userRepository.save(user);
  }

  async revokePermissionFromUser(userId: string, permissionName: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['permissions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.permissions = user.permissions.filter(p => p.name !== permissionName);
    return this.userRepository.save(user);
  }

  async addPermissionToRole(permissionName: string, role: Role): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { name: permissionName },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    permission.allowedRoles = [...(permission.allowedRoles || []), role];
    return this.permissionRepository.save(permission);
  }

  async removePermissionFromRole(permissionName: string, role: Role): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { name: permissionName },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    permission.allowedRoles = permission.allowedRoles.filter(r => r !== role);
    return this.permissionRepository.save(permission);
  }

  async hasPermission(userId: string, permissionName: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['permissions'],
    });

    if (!user) {
      return false;
    }

    const permission = await this.permissionRepository.findOne({
      where: { name: permissionName },
    });

    if (!permission) {
      return false;
    }

    // Администратор имеет все разрешения
    if (user.role === Role.ADMINISTRATOR) {
      return true;
    }

    // Проверяем индивидуальные разрешения пользователя
    if (user.permissions?.some(p => p.name === permissionName)) {
      return true;
    }

    // Проверяем разрешения роли
    return permission.allowedRoles?.includes(user.role) || false;
  }
} 