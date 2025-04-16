import { IsString, IsArray, ArrayMinSize, IsNotEmpty } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  images: string[];
} 