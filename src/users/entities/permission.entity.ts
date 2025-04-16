import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from '../enums/role.enum';
import { User } from './user.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column('simple-array', { nullable: true })
  allowedRoles: Role[];

  @ManyToMany(() => User, user => user.permissions)
  users: User[];
} 