import { Exclude, Expose } from 'class-transformer';
import { Role } from '../../users/enums/role.enum';

@Exclude()
export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  studentGroup: string;

  @Expose()
  role: Role;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  password: string;
  refreshTokens: any[];

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}