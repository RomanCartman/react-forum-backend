import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { sub: string; email: string; username: string };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user.sub);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':username')
  async getUserProfile(
    @Param('username') username: string,
    @Req() req: RequestWithUser,
  ) {
    const isOwnProfile = req.user?.username === username;
    return this.authService.getUserProfile(username, isOwnProfile);
  }
} 