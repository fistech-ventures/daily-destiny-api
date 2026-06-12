import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ENUM_AD_TYPE } from '../../const';

export class AdCreateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'News Title',
  })
  @IsNotEmpty()
  @IsString()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: Object.values(ENUM_AD_TYPE).join(' / '),
  })
  @IsNotEmpty()
  @IsEnum(ENUM_AD_TYPE)
  readonly type!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://en.com/article-x-cover.png',
  })
  @IsOptional()
  readonly imageUrl!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://en.com/ad-x-video.mp4',
  })
  @IsOptional()
  readonly videoUrl!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://en.com/article-x-cover.png',
  })
  @IsOptional()
  readonly scriptEmbedCode!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://en.com/redirect-path',
  })
  @IsOptional()
  readonly redirectUrl!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2025-05-30',
  })
  @IsNotEmpty()
  readonly startDate!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2025-05-30',
  })
  @IsNotEmpty()
  readonly endDate!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive!: boolean;

  @ApiProperty({
    type: String,
    required: false,
    example: 'request uuid',
  })
  @IsOptional()
  readonly requestId!: string;
}
