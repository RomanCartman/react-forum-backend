import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';
import { UsersModule } from '../users/users.module';

//TODO: Доработать систему новостей. Что бы преподаватели и администраторы могли публиковать новости.
@Module({
  imports: [
    TypeOrmModule.forFeature([News]),
    UsersModule,
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
