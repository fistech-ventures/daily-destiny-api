import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDTO } from '@src/app/base';
import { Transform } from 'class-transformer';
import { IsArray, IsBooleanString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ENUM_ARTICLE_LANGUAGE, ENUM_ARTICLE_STATUS } from '../../const';

export class ArticleFilterDTO extends BaseFilterDTO {
  @ApiProperty({ type: Boolean, required: false, description: 'Filter popular articles (sorted by engagement score)' })
  @IsOptional()
  @IsBooleanString()
  readonly isPopular?: string;
  @ApiProperty({ type: Boolean, required: false, description: "true/false" })
  @IsOptional()
  readonly isExclusive?: boolean;

  @ApiProperty({ type: Boolean, required: false, description: "true/false" })
  @IsOptional()
  readonly isFeatured?: boolean;

  @ApiProperty({
    type: String,
    required: false,
    description: 'category uuid',
  })
  @IsOptional()
  readonly categoryId!: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'category uuid',
  })
  @IsOptional()
  readonly subCategoryId!: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'author uuid',
  })
  @IsOptional()
  readonly authorId!: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'type ===> news/series/stories/photo/video',
  })
  @IsOptional()
  readonly type!: string;

  @ApiProperty({
    type: String,
    required: false,
    description: `status => ${Object.values(ENUM_ARTICLE_STATUS).join(' / ')}`,
  })
  @IsOptional()
  @IsEnum(ENUM_ARTICLE_STATUS)
  status!: string;

  @ApiProperty({
    type: String,
    required: false,
    description: `language => ${Object.values(ENUM_ARTICLE_LANGUAGE).join(' / ')}`,
  })
  @IsOptional()
  @IsEnum(ENUM_ARTICLE_LANGUAGE)
  language!: string;

  @ApiProperty({
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  topics?: string[];

  @ApiProperty({
    type: String,
    required: false,
    description: 'division uuid - returns articles from this division and all descendants',
  })
  @IsOptional()
  @IsUUID()
  readonly divisionId?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'district uuid - returns articles from this district and all descendants',
  })
  @IsOptional()
  @IsUUID()
  readonly districtId?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'upazilla uuid - returns articles from this upazilla and all descendants',
  })
  @IsOptional()
  @IsUUID()
  readonly upazillaId?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'union uuid - returns articles from this union',
  })
  @IsOptional()
  @IsUUID()
  readonly unionId?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'location uuid - returns articles from this specific location',
  })
  @IsOptional()
  @IsUUID()
  readonly locationId?: string;

  // @ApiProperty({
  //   type: [String],
  //   required: false,
  //   description: `status => ${Object.values(ENUM_ARTICLE_STATUS)}`,
  // })
  // @IsOptional()
  // @IsEnum(ENUM_ARTICLE_STATUS)
  // statusIn!: string[];
}
