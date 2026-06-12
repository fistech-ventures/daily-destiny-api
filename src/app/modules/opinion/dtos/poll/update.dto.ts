import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { ENUM_ARTICLE_LANGUAGE, ENUM_ARTICLE_STATUS } from '../../const';

export class PollOptionUpdateDTO {
  @ApiProperty({
    type: Number,
    required: false,
    example: 2,
  })
  @IsOptional()
  position!: number;

  @ApiProperty({
    type: String,
    required: false,
    example: 'option title',
  })
  @IsOptional()
  title!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: false,
  })
  @IsOptional()
  isDeleted!: boolean;

  @ApiProperty({
    type: String,
    required: true,
    example: 'uuid',
  })
  @ValidateIf((o) => o.isDeleted)
  id!: string;
}

export class PollUpdateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Politics',
  })
  @IsOptional()
  readonly statement!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Stuff Reporter',
  })
  @IsOptional()
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
  @IsOptional()
  readonly coverImage!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'news details from rich text editor',
  })
  @IsOptional()
  readonly details!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: Object.values(ENUM_ARTICLE_LANGUAGE).join(' / '),
  })
  @IsOptional()
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
  @IsOptional()
  readonly date!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  readonly isActive!: boolean;

  @ApiProperty({
    type: String,
    required: false,
    example: 'author uuid',
  })
  @IsOptional()
  readonly authorId!: string;

  @ApiProperty({
    type: [PollOptionUpdateDTO],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => PollOptionUpdateDTO)
  readonly options!: PollOptionUpdateDTO[];
}
