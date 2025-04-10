import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

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