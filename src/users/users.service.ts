import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';

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
        firstName: true,
        lastName: true,
        studentGroup: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByRole(role: Role) {
    return this.userRepository.find({
      where: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        studentGroup: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
} 