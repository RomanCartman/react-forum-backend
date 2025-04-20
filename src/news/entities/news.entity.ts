import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Expose, Transform } from 'class-transformer';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column('simple-array')
  images: string[];

  @ManyToOne(() => User)
  @Transform(({ value }) => value ? {
    id: value.id,
    username: value.username,
    firstName: value.firstName,
    lastName: value.lastName
  } : null)
  author: User;

  @Column()
  authorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 