import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ENUM_ARTICLE_LANGUAGE, ENUM_ARTICLE_STATUS } from '../../const';

export class ArticleLocationCreateDTO {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Location UUID',
  })
  @IsNotEmpty()
  @IsUUID()
  readonly locationId!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'Mark this as the primary location of the article',
  })
  @IsOptional()
  @IsBoolean()
  readonly isPrimary?: boolean;
}

export class ArticleMediaCreateDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'title',
  })
  @IsOptional()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'caption',
  })
  @IsOptional()
  readonly caption!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'caption',
  })
  @IsOptional()
  readonly credit!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'altText / title',
  })
  @IsOptional()
  readonly altText!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'url',
  })
  @IsNotEmpty()
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
    required: false,
    example: 'youtube/facebook/do-space',
  })
  @IsNotEmpty()
  readonly source!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'png/jpeg/webp',
  })
  @IsOptional()
  readonly mimetype!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '.webp/.WEBP/.WEBM',
  })
  @IsOptional()
  readonly extension!: string;

}

export class ArticleCreateDTO {
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
    required: false,
    example: 'slugified-news-title',
  })
  @IsOptional()
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
    example: 'article hanger text',
  })
  @IsOptional()
  readonly hanger!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'article shoulder text',
  })
  @IsOptional()
  readonly shoulder!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://en.com/article-x-cover.png',
  })
  @IsOptional()
  readonly coverImage!: string;

  @ApiProperty({
    type: String,
    required: false,
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
    type: [String],
    required: false,
    example: ['category-uuid-1', 'category-uuid-2'],
    description: 'Array of category UUIDs',
  })
  @IsOptional()
  @IsArray()
  readonly categoryIds!: string[];

  @ApiProperty({
    type: [String],
    required: false,
    example: ['sub-category-uuid-1', 'sub-category-uuid-2'],
    description: 'Array of sub category UUIDs',
  })
  @IsOptional()
  @IsArray()
  readonly subCategoryIds!: string[];

  @ApiProperty({
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  readonly tags!: string[];

  @ApiProperty({
    type: [ArticleLocationCreateDTO],
    required: false,
    description: 'Array of location assignments for the article',
  })
  @ValidateNested({ each: true })
  @Type(() => ArticleLocationCreateDTO)
  @IsOptional()
  readonly locations?: ArticleLocationCreateDTO[];

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
    type: [ArticleMediaCreateDTO],
    required: false,
  })
  @ValidateNested()
  @Type(() => ArticleMediaCreateDTO)
  @IsOptional()
  readonly medias!: ArticleMediaCreateDTO[];

  @ApiProperty({
    type: String,
    required: false,
    example: 'news short title',
  })
  @IsOptional()
  readonly metaTitle!: string;

  @ApiProperty({
    type: String,
    required: false,
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
  createdBy?: any;
}
