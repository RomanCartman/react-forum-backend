import { Exclude } from 'class-transformer';

export class UserDto {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  refreshTokens: any[];
}