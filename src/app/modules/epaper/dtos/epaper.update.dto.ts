import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { EpaperPageDTO } from './epaper.bulk-upload.dto';

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

  @ApiProperty({
    type: [EpaperPageDTO],
    required: false,
    description: 'Additional pages to add for this date and publication',
  })
  @IsOptional()
  @IsArray()
  readonly pages?: EpaperPageDTO[];
}
