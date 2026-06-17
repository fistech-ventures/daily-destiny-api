import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { ENUM_ARTICLE_LANGUAGE, ENUM_ARTICLE_STATUS } from '../../const';

export class ArticleLocationUpdateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Location UUID',
  })
  @IsUUID()
  readonly locationId!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
    description: 'Mark this as the primary location of the article',
  })
  @IsOptional()
  @IsBoolean()
  readonly isPrimary?: boolean;
}

export class ArticleMediaUpdateDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'title',
  })
  @IsOptional()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'caption',
  })
  @IsOptional()
  readonly caption!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'caption',
  })
  @IsOptional()
  readonly credit!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'altText / title',
  })
  @IsOptional()
  readonly altText!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'url',
  })
  @IsOptional()
  readonly url!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'key',
  })
  @IsOptional()
  readonly key!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'youtube/facebook/do-space',
  })
  @IsOptional()
  readonly source!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'png/jpeg/webp',
  })
  @IsOptional()
  readonly mimetype!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '.webp/.WEBP/.WEBM',
  })
  @IsOptional()
  readonly extension!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '7efe629c-3e94-4fa7-a26d-7c5216e41d93',
  })
  @IsOptional()
  readonly id!: any;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isDeleted!: boolean;

  @IsOptional()
  readonly updatedBy?: any;
}

export class ArticleUpdateDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'News Title',
  })
  @IsOptional()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'slugified-news-title',
  })
  @IsOptional()
  readonly slug!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'article type',
  })
  @IsOptional()
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
    required: false,
    example: 'news short details',
  })
  @IsOptional()
  readonly excerpt!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'news details from rich text editor',
  })
  @IsOptional()
  readonly details!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://en.com/article-x-cover.png',
  })
  @IsOptional()
  readonly coverImage!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Burning Iran | Robin Jaman / Facebook / Reuters',
  })
  @IsOptional()
  readonly coverImageCredit!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2025-05-30',
  })
  @IsOptional()
  readonly date!: string;

  @ApiProperty({ type: Boolean, required: false, example: false })
  @IsOptional()
  readonly isExclusive?: boolean;

  @ApiProperty({ type: Boolean, required: false, example: false })
  @IsOptional()
  readonly isFeatured?: boolean;

  @ApiProperty({
    type: String,
    required: false,
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
  readonly status!: ENUM_ARTICLE_STATUS;

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
    type: String,
    required: false,
    example: 'category uuid',
  })
  @IsOptional()
  readonly categoryId!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'sub category uuid',
  })
  @IsOptional()
  readonly subCategoryId!: string;

  @ApiProperty({
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  readonly tags!: string[];

  @ApiProperty({
    type: [ArticleLocationUpdateDTO],
    required: false,
    description: 'Array of location assignments for the article',
  })
  @ValidateNested({ each: true })
  @Type(() => ArticleLocationUpdateDTO)
  @IsOptional()
  readonly locations?: ArticleLocationUpdateDTO[];

  @ApiProperty({
    type: String,
    required: false,
    description: 'Division UUID for hierarchical location assignment',
  })
  @IsOptional()
  @IsUUID()
  readonly divisionId?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'District UUID for hierarchical location assignment',
  })
  @IsOptional()
  @IsUUID()
  readonly districtId?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Upazilla UUID for hierarchical location assignment',
  })
  @IsOptional()
  @IsUUID()
  readonly upazillaId?: string;

  @ApiProperty({
    type: [ArticleMediaUpdateDTO],
    required: false,
  })
  @ValidateNested()
  @Type(() => ArticleMediaUpdateDTO)
  @IsOptional()
  readonly medias!: ArticleMediaUpdateDTO[];

  @ApiProperty({
    type: String,
    required: true,
    example: 'news short title',
  })
  @IsOptional()
  readonly metaTitle!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'news short details',
  })
  @IsOptional()
  readonly metaDescription!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'custom preview image',
  })
  @IsOptional()
  readonly metaImage!: string;

  @ApiProperty({
    type: [String],
    required: false,
    example: ['custom preview image', 'news', 'bengali'],
  })
  @IsOptional()
  readonly metaKeywords!: string[];

  @IsOptional()
  updatedBy?: any;
}
