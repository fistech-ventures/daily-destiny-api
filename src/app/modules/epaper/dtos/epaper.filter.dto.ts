import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDTO } from '@src/app/base';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class EpaperFilterDTO extends BaseFilterDTO {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Filter by publication name',
    example: 'Daily Prothom Alo',
  })
  @IsOptional()
  @IsString()
  readonly publicationName?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Filter by date (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDateString()
  readonly date?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Filter by date range start (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  readonly dateFrom?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Filter by date range end (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @IsOptional()
  @IsDateString()
  readonly dateTo?: string;
}
