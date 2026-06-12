import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ENUM_AD_TYPE } from '../../const';

export class AdUpdateDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'News Title',
  })
  @IsOptional()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: Object.values(ENUM_AD_TYPE).join(' / '),
  })
  @IsOptional()
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
  @IsOptional()
  readonly startDate!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2025-05-30',
  })
  @IsOptional()
  readonly endDate!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  readonly isActive!: boolean;

  @ApiProperty({
    type: String,
    required: false,
    example: 'request uuid',
  })
  @IsOptional()
  readonly requestId!: string;
}
