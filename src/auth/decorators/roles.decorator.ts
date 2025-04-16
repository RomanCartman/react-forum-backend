import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../../users/services/role.service';

export const Roles = (...roles: RoleName[]) => SetMetadata('roles', roles); 