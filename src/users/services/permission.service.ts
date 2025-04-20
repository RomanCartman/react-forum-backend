import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { PermissionName } from '../enums/permission.enum';

@Injectable()
export class PermissionService implements OnModuleInit {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.initializePermissions();
  }

  private async initializePermissions() {
    const permissions = [
      {
        name: PermissionName.CREATE_NEWS,
        description: 'Ability to create news articles',
      },
      {
        name: PermissionName.UPDATE_NEWS,
        description: 'Ability to update news articles',
      },
      {
        name: PermissionName.DELETE_NEWS,
        description: 'Ability to delete news articles',
      },
      {
        name: PermissionName.MANAGE_USERS,
        description: 'Ability to manage users',
      },
      {
        name: PermissionName.MANAGE_ROLES,
        description: 'Ability to manage roles',
      },
      {
        name: PermissionName.MANAGE_PERMISSIONS,
        description: 'Ability to manage permissions',
      },
    ];

    // Получаем все существующие разрешения за один запрос
    const existingPermissions = await this.permissionRepository.find();
    const existingPermissionMap = new Map(
      existingPermissions.map(p => [p.name, p])
    );

    // Создаем разрешения последовательно
    for (const permissionData of permissions) {
      try {
        if (!existingPermissionMap.has(permissionData.name)) {
          this.logger.log(`Creating permission: ${permissionData.name}`);
          const newPermission = this.permissionRepository.create(permissionData);
          await this.permissionRepository.save(newPermission);
          existingPermissionMap.set(permissionData.name, newPermission);
        } else {
          this.logger.log(`Permission already exists: ${permissionData.name}`);
        }
      } catch (error) {
        // Игнорируем ошибку дублирования (на случай race condition)
        if (!error.message.includes('duplicate key value')) {
          this.logger.error(
            `Error while creating permission ${permissionData.name}: ${error.message}`
          );
        }
      }
    }
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async findByName(name: PermissionName): Promise<Permission | null> {
    return this.permissionRepository.findOne({
      where: { name },
    });
  }

  async findById(id: string): Promise<Permission | null> {
    return this.permissionRepository.findOne({
      where: { id },
    });
  }

  async createPermission(name: string, description: string): Promise<Permission> {
    const permission = this.permissionRepository.create({
      name,
      description,
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

    if (!user.permissions) {
      user.permissions = [];
    }

    // Проверяем, нет ли уже такого разрешения
    if (!user.permissions.some(p => p.id === permission.id)) {
      user.permissions.push(permission);
    }

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

  async grantPermissionToRole(roleId: string, permissionName: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permission = await this.permissionRepository.findOne({
      where: { name: permissionName },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (!role.permissions) {
      role.permissions = [];
    }

    // Проверяем, нет ли уже такого разрешения
    if (!role.permissions.some(p => p.id === permission.id)) {
      role.permissions.push(permission);
    }

    return this.roleRepository.save(role);
  }

  async revokePermissionFromRole(roleId: string, permissionName: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    role.permissions = role.permissions.filter(p => p.name !== permissionName);
    return this.roleRepository.save(role);
  }

  async hasPermission(userId: string, permissionName: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['permissions', 'roles', 'roles.permissions'],
    });

    if (!user) {
      return false;
    }

    // Проверяем прямые разрешения пользователя
    const hasDirectPermission = user.permissions.some(
      (permission) => permission.name === permissionName
    );

    if (hasDirectPermission) {
      return true;
    }

    // Проверяем разрешения ролей пользователя
    const hasRolePermission = user.roles.some((role) =>
      role.permissions.some((permission) => permission.name === permissionName)
    );

    return hasRolePermission;
  }
} 