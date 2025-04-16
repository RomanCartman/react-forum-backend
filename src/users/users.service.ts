import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RoleName } from './services/role.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['roles', 'roles.permissions'],
      select: ['id', 'email', 'username', 'firstName', 'lastName', 'studentGroup', 'roles'],
    });
  }

  async findByRole(roleName: RoleName): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('role.name = :roleName', { roleName })
      .select([
        'user.id',
        'user.email',
        'user.username',
        'user.firstName',
        'user.lastName',
        'user.studentGroup',
        'role',
        'permission'
      ])
      .getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
      select: ['id', 'email', 'username', 'firstName', 'lastName', 'studentGroup', 'roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
      select: ['id', 'email', 'username', 'firstName', 'lastName', 'studentGroup', 'roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }
} 