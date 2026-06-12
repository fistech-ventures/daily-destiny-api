import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class HeroBannerCreateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Highlighted Text',
  })
  @IsNotEmpty()
  @IsString()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'slugified-news-title',
  })
  @IsNotEmpty()
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
  @IsBoolean()
  readonly isActive!: boolean;

  @ApiProperty({
    type: Number,
    required: false,
    example: 2,
  })
  @IsOptional()
  readonly position!: number;
}
