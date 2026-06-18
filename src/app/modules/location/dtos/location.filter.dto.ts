import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDTO } from '@src/app/base';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ENUM_LOCATION_TYPE } from '@src/shared/enums/common.enums';

export class LocationFilterDTO extends BaseFilterDTO {
  @ApiProperty({
    enum: ENUM_LOCATION_TYPE,
    required: false,
    description: 'Filter by location type',
  })
  @IsOptional()
  @IsEnum(ENUM_LOCATION_TYPE)
  readonly type?: ENUM_LOCATION_TYPE;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Parent location UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  readonly parentId?: string;

  @ApiProperty({
    type: String,
    example: 'position',
    required: false,
  })
  @IsOptional()
  sortBy!: string;
}
