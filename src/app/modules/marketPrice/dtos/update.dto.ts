import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MarketPriceUpdateDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Ahmed Chofa',
  })
  @IsOptional()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'আহমেদ ছফা',
  })
  @IsOptional()
  readonly titleBn!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'fibonaccibooks.com/author-image.jpg',
  })
  @IsOptional()
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
  readonly isActive!: boolean;
}
