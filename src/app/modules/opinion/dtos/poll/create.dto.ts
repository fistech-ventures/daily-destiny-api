import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ENUM_ARTICLE_LANGUAGE, ENUM_ARTICLE_STATUS } from '../../const';

export class PollItemCreateDTO {
  @ApiProperty({
    type: Number,
    required: true,
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  position!: number;

  @ApiProperty({
    type: String,
    required: true,
    example: 'option title',
  })
  @IsNotEmpty()
  @IsString()
  title!: string;
}

export class PollCreateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'What is opinion',
  })
  @IsNotEmpty()
  @IsString()
  readonly statement!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'slugified-statement',
  })
  @IsNotEmpty()
  readonly slug!: string;

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
    example: 'https://en.com/article-x-cover.png',
  })
  @IsNotEmpty()
  readonly coverImage!: string;

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
    type: String,
    required: true,
    example: '2025-05-30',
  })
  @IsNotEmpty()
  readonly date!: string;

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
    type: [PollItemCreateDTO],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => PollItemCreateDTO)
  readonly options!: PollItemCreateDTO[];
}
