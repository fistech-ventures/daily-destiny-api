import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ENUM_ARTICLE_LANGUAGE, ENUM_ARTICLE_STATUS } from '../../const';

export class OpinionCreateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'News Title',
  })
  @IsNotEmpty()
  @IsString()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'slugified-news-title',
  })
  @IsNotEmpty()
  readonly slug!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'article type',
  })
  @IsNotEmpty()
  readonly type!: string;

  @ApiProperty({
    type: Number,
    required: false,
    example: 'article position',
  })
  @IsOptional()
  readonly position!: number;

  @ApiProperty({
    type: String,
    required: true,
    example: 'news details from rich text editor',
  })
  @IsNotEmpty()
  readonly details!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'https://en.com/article-x-cover.png',
  })
  @IsNotEmpty()
  readonly coverImage!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '2025-05-30',
  })
  @IsNotEmpty()
  readonly date!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: Object.values(ENUM_ARTICLE_LANGUAGE).join(' / '),
  })
  @IsNotEmpty()
  @IsEnum(ENUM_ARTICLE_LANGUAGE)
  readonly language!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: Object.values(ENUM_ARTICLE_STATUS).join(' / '),
  })
  @IsOptional()
  @IsEnum(ENUM_ARTICLE_STATUS)
  readonly status!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive!: boolean;

  @ApiProperty({
    type: String,
    required: false,
    example: 'author uuid',
  })
  @IsOptional()
  readonly authorId!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'category uuid',
  })
  @IsOptional()
  readonly categoryId!: string;
}
