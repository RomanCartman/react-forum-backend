import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../users/guards/permission.guard';
import { RequirePermissions } from '../users/guards/permission.guard';
import { Request } from 'express';
import { PermissionName } from '../users/enums/permission.enum';

interface RequestWithUser extends Request {
  user: { sub: string };
}

@Controller('news')
@UseInterceptors(ClassSerializerInterceptor)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(PermissionName.CREATE_NEWS)
  @Post()
  create(@Body() createNewsDto: CreateNewsDto, @Req() req: RequestWithUser) {
    return this.newsService.create(createNewsDto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(PermissionName.UPDATE_NEWS)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @Req() req: RequestWithUser,
  ) {
    return this.newsService.update(id, updateNewsDto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(PermissionName.DELETE_NEWS)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.newsService.remove(id, req.user.sub);
  }
}
