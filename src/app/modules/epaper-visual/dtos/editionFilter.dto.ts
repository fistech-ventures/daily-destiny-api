import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDTO } from '@src/app/base';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ENUM_EDITION_STATUS } from '../entities/edition.entity';

export class EditionFilterDTO extends BaseFilterDTO {
  @ApiProperty({
    type: String,
    required: false,
    enum: ENUM_EDITION_STATUS,
    description: 'Filter by edition status',
  })
  @IsOptional()
  @IsEnum(ENUM_EDITION_STATUS)
  readonly status?: ENUM_EDITION_STATUS;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Filter by exact publish date (YYYY-MM-DD)',
    example: '2024-06-16',
  })
  @IsOptional()
  @IsDateString()
  readonly publishDate?: string;
}
