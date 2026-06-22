import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ENUM_EDITION_STATUS } from '../entities/edition.entity';

export class CreateEditionDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: '2024-06-16',
    description: 'Publication date of the edition (YYYY-MM-DD)',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly publishDate!: string;

  @ApiProperty({
    type: String,
    required: false,
    enum: ENUM_EDITION_STATUS,
    default: ENUM_EDITION_STATUS.DRAFT,
    description: 'Edition status',
  })
  @IsOptional()
  @IsEnum(ENUM_EDITION_STATUS)
  readonly status?: ENUM_EDITION_STATUS;
}
