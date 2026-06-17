import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class LocationSeedItemDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Dhaka',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'ঢাকা',
  })
  @IsOptional()
  @IsString()
  nameBn?: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'dhaka',
  })
  @IsNotEmpty()
  @IsString()
  slug!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'division',
    enum: ['country', 'division', 'district', 'upazilla', 'union', 'city_corporation', 'pourosova'],
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(['country', 'division', 'district', 'upazilla', 'union', 'city_corporation', 'pourosova'])
  type!: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Parent slug to resolve parent ID',
    example: 'dhaka',
  })
  @IsOptional()
  @IsString()
  parentSlug?: string;

  @ApiProperty({
    type: Number,
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  position?: number;
}

export class LocationSeedDTO {
  @ApiProperty({
    type: [LocationSeedItemDTO],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationSeedItemDTO)
  readonly locations!: LocationSeedItemDTO[];
}
