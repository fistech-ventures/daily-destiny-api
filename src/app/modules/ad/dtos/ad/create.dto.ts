import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ENUM_AD_TYPE } from '../../const';

export class AdCreateDTO {
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
    example: Object.values(ENUM_AD_TYPE).join(' / '),
  })
  @IsNotEmpty()
  @IsEnum(ENUM_AD_TYPE)
  readonly type!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://en.com/article-x-cover.png',
  })
  @IsOptional()
  readonly imageUrl!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://en.com/ad-x-video.mp4',
  })
  @IsOptional()
  readonly videoUrl!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://en.com/article-x-cover.png',
  })
  @IsOptional()
  readonly scriptEmbedCode!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://en.com/redirect-path',
  })
  @IsOptional()
  readonly redirectUrl!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2025-05-30',
  })
  @IsNotEmpty()
  readonly startDate!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2025-05-30',
  })
  @IsNotEmpty()
  readonly endDate!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'homePage',
    description: 'Page type where the ad will be displayed (e.g., homePage, recentPage, videoPage, epaperPage, galleryDetailsPage, categoryPage)',
  })
  @IsOptional()
  @IsString()
  readonly pageType!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Home-TopBanner',
    description: 'Position on the page (e.g., Home-TopBanner, Lead-Right, Area-Under, Mid-Banner, Footer-Up-Banner, Right-Sidebar, etc.)',
  })
  @IsOptional()
  @IsString()
  readonly position!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive!: boolean;
}
