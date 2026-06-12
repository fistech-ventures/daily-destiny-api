import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUUIDArray } from '../decorators';
enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BaseFilterDTO {
  @ApiProperty({
    type: Number,
    description: 'The page number',
    default: 1,
    required: false,
  })
  @IsOptional()
  readonly page: number = 1;

  @ApiProperty({
    type: Number,
    description: 'Limit the number of results',
    default: 10,
    required: false,
  })
  @IsOptional()
  readonly limit: number = 10;

  @ApiProperty({ required: false })
  @IsBooleanString()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({
    type: String,
    description: 'The search term',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly searchTerm!: string;

  @ApiProperty({
    type: String,
    description: new Date().toString(),
    default: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly startDate!: string;

  @ApiProperty({
    type: String,
    description: new Date().toString(),
    default: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly endDate!: string;

  @ApiProperty({
    type: String,
    description: 'createdAt',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly sortBy!: string;

  @ApiProperty({
    type: String,
    description: 'ASC/DESC',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly sortOrder!: SortOrder;
}

export class FilterBulkByIdsDTO {
  @ApiProperty({
    type: [String],
    description: `id array ['uuid','uuid']`,
    example: ['8ecf938a-b380-4279-8768-ed7743eb6f70'],
    default: '',
    required: true,
  })
  @IsNotEmpty()
  @IsUUIDArray()
  ids!: string[];
}
