import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class EpaperUpdateDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: '2024-01-15',
    description: 'Date of the e-paper publication',
  })
  @IsOptional()
  @IsDateString()
  readonly date?: string;

  @ApiProperty({
    type: Number,
    required: false,
    example: 1,
    description: 'Page number of the e-paper',
  })
  @IsOptional()
  @IsNumber()
  readonly pageNumber?: number;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://example.com/epaper-image.jpg',
    description: 'URL of the e-paper image',
  })
  @IsOptional()
  @IsString()
  readonly imageUrl?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'epaper/2024-01-15/page-1.jpg',
    description: 'Storage key for the e-paper image',
  })
  @IsOptional()
  @IsString()
  readonly imageKey?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://example.com/epaper-thumbnail.jpg',
    description: 'URL of the thumbnail image',
  })
  @IsOptional()
  @IsString()
  readonly thumbnailUrl?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'epaper/2024-01-15/thumbnail-page-1.jpg',
    description: 'Storage key for the thumbnail image',
  })
  @IsOptional()
  @IsString()
  readonly thumbnailKey?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Daily Prothom Alo',
    description: 'Name of the publication',
  })
  @IsOptional()
  @IsString()
  readonly publicationName?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Front Page',
    description: 'Title or description of the page',
  })
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
    description: 'Active status',
  })
  @IsOptional()
  readonly isActive?: boolean;

  @ApiProperty({
    type: Number,
    required: false,
    example: 2048576,
    description: 'File size in bytes',
  })
  @IsOptional()
  @IsNumber()
  readonly fileSize?: number;
}
