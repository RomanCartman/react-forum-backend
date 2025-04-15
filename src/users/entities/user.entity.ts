import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { Role } from '../enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true, default: null })
  studentGroup: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];
} 