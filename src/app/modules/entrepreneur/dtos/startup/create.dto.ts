import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class StartupFounderCreateDTO {
  @ApiProperty({
    type: Number,
    required: true,
    example: 'the id of the Entrepreneur',
  })
  @IsNotEmpty()
  @IsString()
  founderId!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'CEO',
  })
  @IsNotEmpty()
  @IsString()
  designation!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '2025-07-27',
  })
  @IsNotEmpty()
  @IsString()
  joined!: string;
}

export class StartupCreateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Book Wave',
  })
  @IsNotEmpty()
  @IsString()
  readonly name!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://bookwave.com/assetes/logo.png',
  })
  @IsOptional()
  @IsString()
  readonly logo!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '2025-07-27',
  })
  @IsNotEmpty()
  @IsString()
  readonly established!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'About the company',
  })
  @IsOptional()
  @IsString()
  readonly brief!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://bookwave.com',
  })
  @IsOptional()
  @IsString()
  readonly website!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'hello@bookwave.com',
  })
  @IsOptional()
  @IsString()
  readonly email!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '8801212121221',
  })
  @IsOptional()
  @IsString()
  readonly phoneNumber!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '178/A, Road 2, Banani, Dhaka',
  })
  @IsOptional()
  readonly address!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive!: boolean;

  @ApiProperty({
    type: [StartupFounderCreateDTO],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => StartupFounderCreateDTO)
  readonly founders!: StartupFounderCreateDTO[];
}
