import { ApiProperty } from '@nestjs/swagger';
import { ENUM_LOCATION_TYPE } from '@src/shared/enums/common.enums';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

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

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}
