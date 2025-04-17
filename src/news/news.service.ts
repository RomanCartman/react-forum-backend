import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  async create(createNewsDto: CreateNewsDto, userId: string): Promise<News> {
    const news = this.newsRepository.create({
      ...createNewsDto,
      authorId: userId,
    });
    return this.newsRepository.save(news);
  }

  async findAll(): Promise<News[]> {
    return this.newsRepository.find({
      relations: ['author'],
      select: {
        id: true,
        title: true,
        content: true,
        images: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        author: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        }
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['author'],
      select: {
        id: true,
        title: true,
        content: true,
        images: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        author: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        }
      },
    });

    if (!news) {
      throw new NotFoundException('News not found');
    }

    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto, userId: string): Promise<News> {
    const news = await this.findOne(id);

    if (news.authorId !== userId) {
      throw new NotFoundException('You can only update your own news');
    }

    await this.newsRepository.update(id, updateNewsDto);
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const news = await this.findOne(id);

    if (news.authorId !== userId) {
      throw new NotFoundException('You can only delete your own news');
    }

    await this.newsRepository.delete(id);
  }
}
