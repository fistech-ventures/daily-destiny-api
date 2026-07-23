import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AdFilterDTO {
  @ApiProperty({
    type: Number,
    description: 'The page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  readonly page: number = 1;

  @ApiProperty({
    type: Number,
    description: 'Limit the number of results',
    example: 10,
    required: false,
  })
  @IsOptional()
  readonly limit: number = 10;

  @ApiProperty({
    type: String,
    description: 'The search term',
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly searchTerm!: string;

  @ApiProperty({
    type: Boolean,
    example: '',
    required: false,
  })
  @IsOptional()
  readonly isActive!: boolean;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Filter by page type (e.g., homePage, recentPage, videoPage, epaperPage, galleryDetailsPage, categoryPage)',
  })
  @IsOptional()
  @IsString()
  readonly pageType!: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Filter by position on the page (e.g., Home-TopBanner, Lead-Right, Area-Under, Mid-Banner, Footer-Up-Banner, Right-Sidebar, etc.)',
  })
  @IsOptional()
  @IsString()
  readonly position!: string;
}
