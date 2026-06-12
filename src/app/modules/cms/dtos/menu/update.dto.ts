import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ENUM_LANGUAGE } from '../../const';

export class MenuUpdateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Politics',
  })
  @IsOptional()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Stuff Reporter',
  })
  @IsOptional()
  readonly slug!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://adtravelbd.com',
  })
  @IsOptional()
  readonly externalUrl!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: Object.values(ENUM_LANGUAGE).join(' / '),
  })
  @IsOptional()
  @IsEnum(ENUM_LANGUAGE)
  readonly language!: string;

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

  @ApiProperty({
    type: String,
    required: false,
    example: 'page uuid',
  })
  @IsOptional()
  readonly pageId!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'parent menu uuid',
  })
  @IsOptional()
  readonly parentId!: string;
}
