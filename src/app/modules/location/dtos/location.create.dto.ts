import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ENUM_LOCATION_TYPE } from '@src/shared/enums/common.enums';

export class LocationCreateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Dhaka',
  })
  @IsNotEmpty()
  @IsString()
  readonly name!: string;

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
    required: true,
    example: 'dhaka',
  })
  @IsNotEmpty()
  @IsString()
  readonly slug!: string;

  @ApiProperty({
    enum: ENUM_LOCATION_TYPE,
    required: true,
    example: ENUM_LOCATION_TYPE.DIVISION,
  })
  @IsNotEmpty()
  @IsEnum(ENUM_LOCATION_TYPE)
  readonly type!: ENUM_LOCATION_TYPE;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Parent location UUID (required for all except divisions)',
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
  readonly position?: number;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  readonly isActive?: boolean;
}
