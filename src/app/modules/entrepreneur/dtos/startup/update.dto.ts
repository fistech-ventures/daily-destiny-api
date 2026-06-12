import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateIf, ValidateNested } from 'class-validator';

export class StartupFounderUpdateDTO {
  @ApiProperty({
    type: Boolean,
    required: false,
    example: false,
  })
  @IsOptional()
  isDeleted!: boolean;

  @ApiProperty({
    type: String,
    required: true,
    example: 'uuid',
  })
  @ValidateIf((o) => o.isDeleted)
  id!: string;

  @ApiProperty({
    type: Number,
    required: false,
    example: 'the id of the Entrepreneur',
  })
  @IsOptional()
  founderId!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'CEO',
  })
  @IsOptional()
  designation!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2025-07-27',
  })
  @IsOptional()
  joined!: string;
}

export class StartupUpdateDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Book Wave',
  })
  @IsOptional()
  readonly name!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://bookwave.com/assetes/logo.png',
  })
  @IsOptional()
  readonly logo!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2025-07-27',
  })
  @IsOptional()
  readonly established!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'About the company',
  })
  @IsOptional()
  readonly brief!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://bookwave.com',
  })
  @IsOptional()
  readonly website!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'hello@bookwave.com',
  })
  @IsOptional()
  readonly email!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '8801212121221',
  })
  @IsOptional()
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
    type: [StartupFounderUpdateDTO],
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => StartupFounderUpdateDTO)
  readonly founders!: StartupFounderUpdateDTO[];
}
