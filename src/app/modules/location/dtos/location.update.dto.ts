import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';
import { ENUM_LOCATION_TYPE } from '@src/shared/enums/common.enums';

export class LocationUpdateDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Dhaka',
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'ঢাকা',
  })
  @IsOptional()
  @IsString()
  readonly nameBn?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'dhaka',
  })
  @IsOptional()
  @IsString()
  readonly slug?: string;

  @ApiProperty({
    enum: ENUM_LOCATION_TYPE,
    required: false,
    example: ENUM_LOCATION_TYPE.DIVISION,
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
    type: Number,
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  readonly position?: number;
}
