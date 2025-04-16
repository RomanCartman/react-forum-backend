import { Injectable, NotFoundException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Permission } from '../entities/permission.entity';
import { PermissionService } from './permission.service';

export enum RoleName {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMINISTRATOR = 'administrator',
}

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly permissionService: PermissionService,
  ) {}

  async onModuleInit() {
    await this.permissionService.onModuleInit();
    await this.initializeRoles();
  }

  private async initializeRoles() {
    const roles = [
      {
        name: RoleName.STUDENT,
        description: 'Regular student user with basic permissions',
      },
      {
        name: RoleName.TEACHER,
        description: 'Teacher with elevated permissions',
      },
      {
        name: RoleName.ADMINISTRATOR,
        description: 'Administrator with full access to all features',
      },
    ];

    for (const roleData of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        
        // Если это администратор, добавляем все существующие разрешения
        if (roleData.name === RoleName.ADMINISTRATOR) {
          const allPermissions = await this.permissionRepository.find();
          role.permissions = allPermissions;
        }

        await this.roleRepository.save(role);
      }
    }
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }

    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // Проверяем, не пытаемся ли мы изменить системную роль
    if ([RoleName.STUDENT, RoleName.TEACHER, RoleName.ADMINISTRATOR].includes(role.name as RoleName)) {
      throw new ConflictException('Cannot modify system role');
    }

    if (updateRoleDto.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (existingRole && existingRole.id !== id) {
        throw new ConflictException('Role with this name already exists');
      }
    }

    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);

    // Проверяем, не пытаемся ли мы удалить системную роль
    if ([RoleName.STUDENT, RoleName.TEACHER, RoleName.ADMINISTRATOR].includes(role.name as RoleName)) {
      throw new ConflictException('Cannot delete system role');
    }

    await this.roleRepository.delete(id);
  }

  async findByName(name: RoleName): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });
  }

  async addPermissionToRole(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!role || !permission) {
      throw new Error('Role or Permission not found');
    }

    if (!role.permissions.some(p => p.id === permission.id)) {
      role.permissions.push(permission);
      await this.roleRepository.save(role);
    }

    return role;
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new Error('Role not found');
    }

    role.permissions = role.permissions.filter(p => p.id !== permissionId);
    return this.roleRepository.save(role);
  }
} 