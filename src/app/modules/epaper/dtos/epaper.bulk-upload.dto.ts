import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class EpaperPageDTO {
  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
    description: 'Page number',
  })
  @IsNotEmpty()
  @IsNumber()
  pageNumber!: number;

  @ApiProperty({
    type: String,
    required: true,
    example: 'https://example.com/epaper-image.jpg',
    description: 'URL of the e-paper image',
  })
  @IsNotEmpty()
  @IsString()
  imageUrl!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'epaper/2024-06-16/page-1.jpg',
    description: 'Storage key for the e-paper image',
  })
  @IsNotEmpty()
  @IsString()
  imageKey!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Front Page',
    description: 'Title or description of the page',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'image/jpeg',
    description: 'MIME type of the image',
  })
  @IsNotEmpty()
  @IsString()
  mimetype!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'jpg',
    description: 'File extension',
  })
  @IsNotEmpty()
  @IsString()
  extension!: string;

  @ApiProperty({
    type: Number,
    required: false,
    example: 2048576,
    description: 'File size in bytes',
  })
  @IsOptional()
  @IsNumber()
  fileSize?: number;
}

export class EpaperBulkUploadDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: '2024-06-16',
    description: 'Date of the e-paper publication',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly date!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Daily Prothom Alo',
    description: 'Name of the publication',
  })
  @IsNotEmpty()
  @IsString()
  readonly publicationName!: string;

  @ApiProperty({
    type: [EpaperPageDTO],
    required: true,
    description: 'Array of pages to upload',
  })
  @IsNotEmpty()
  @IsArray()
  readonly pages!: EpaperPageDTO[];
}
