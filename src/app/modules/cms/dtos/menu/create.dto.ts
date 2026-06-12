import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ENUM_LANGUAGE } from '../../const';

export class MenuCreateDTO {
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
    required: false,
    example: 'https://adtravelbd.com',
  })
  @IsOptional()
  readonly externalUrl!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: Object.values(ENUM_LANGUAGE).join(' / '),
  })
  @IsNotEmpty()
  @IsEnum(ENUM_LANGUAGE)
  readonly language!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive!: boolean;

  @ApiProperty({
    type: Number,
    required: false,
    example: 2,
  })
  @IsOptional()
  readonly position!: number;

  @ApiProperty({
    type: String,
    required: false,
    example: 'page uuid',
  })
  @IsOptional()
  readonly pageId!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'parent menu uuid',
  })
  @IsOptional()
  readonly parentId!: string;
}
