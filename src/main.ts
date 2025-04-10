import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Защита от XSS и других веб-уязвимостей
  app.use(helmet());
  
  // CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Замените на URL вашего фронтенда
    credentials: true,
  });
  
  // Глобальная валидация DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
