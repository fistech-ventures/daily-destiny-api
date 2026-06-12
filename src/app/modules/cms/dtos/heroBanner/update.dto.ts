import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class HeroBannerUpdateDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Highlighted Text',
  })
  @IsOptional()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'slugified-news-title',
  })
  @IsOptional()
  readonly slug!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://adtravelbd.com',
  })
  @IsOptional()
  readonly url!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://adtravelbd.com',
  })
  @IsOptional()
  readonly redirectUrl!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  readonly isActive!: boolean;

  @ApiProperty({
    type: Number,
    required: false,
    example: 2,
  })
  @IsOptional()
  readonly position!: number;
}
