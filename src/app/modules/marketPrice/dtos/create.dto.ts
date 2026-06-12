import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MarketPriceCreateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Ahmed Chofa',
  })
  @IsNotEmpty()
  @IsString()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'আহমেদ ছফা',
  })
  @IsNotEmpty()
  @IsString()
  readonly titleBn!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'enews.com/author-image.jpg',
  })
  @IsOptional()
  @IsString()
  readonly image!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: "340 to 360 per kg",
  })
  @IsOptional()
  @IsString()
  readonly priceRange!: string;

  @ApiProperty({
    type: Number,
    required: false,
    example: 2,
  })
  @IsOptional()
  readonly position!: number;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive!: boolean;
}
