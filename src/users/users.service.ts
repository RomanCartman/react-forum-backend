import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        studentGroup: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: ['roles'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByRole(roleId: string) {
    return this.userRepository.find({
      where: {
        roles: {
          id: roleId
        }
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        studentGroup: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: ['roles'],
    });
  }
} 