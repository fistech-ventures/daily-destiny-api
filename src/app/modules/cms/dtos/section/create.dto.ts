import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ENUM_SECTION_LAYOUT, ENUM_SECTION_TYPE } from '../../const';

export class SectionItemCreateDTO {
  @ApiProperty({
    type: Number,
    required: true,
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  position!: number;

  @ApiProperty({
    type: String,
    required: false,
    example: 'article uuid',
  })
  @IsOptional()
  @IsUUID()
  articleId!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'ad uuid',
  })
  @IsOptional()
  @IsUUID()
  adId!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'poll uuid',
  })
  @IsOptional()
  @IsUUID()
  pollId!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'opinion uuid',
  })
  @IsOptional()
  @IsUUID()
  opinionId!: string;
}

export class SectionCreateDTO {
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
    required: true,
    example: 'Fund Raise',
  })
  @IsNotEmpty()
  @IsString()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Get to know how much one worth',
  })
  @IsOptional()
  readonly subTitle!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://adtravelbd.com / category/fund-raise',
  })
  @IsOptional()
  readonly redirectTo!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://adtravelbd.com/banner.jpg',
  })
  @IsOptional()
  readonly banner!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isDefaultHomeSection!: boolean;

  @ApiProperty({
    type: String,
    required: true,
    example: Object.values(ENUM_SECTION_TYPE).join(' / '),
  })
  @IsNotEmpty()
  @IsEnum(ENUM_SECTION_TYPE)
  readonly type!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: Object.values(ENUM_SECTION_LAYOUT).join(' / '),
  })
  @IsNotEmpty()
  // @IsEnum(ENUM_SECTION_LAYOUT)
  readonly layout!: string;

  @ApiProperty({
    type: Object,
    required: false,
    example: { filter: 'trending', category: 'news' },
  })
  @IsOptional()
  readonly config!: any;

  @ApiProperty({
    type: String,
    required: false,
    example: 'page uuid',
  })
  @IsOptional()
  readonly pageId!: string;

  @ApiProperty({
    type: Number,
    required: false,
    example: 2,
  })
  @IsOptional()
  readonly position!: number;

  @ApiProperty({
    type: [SectionItemCreateDTO],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => SectionItemCreateDTO)
  readonly items!: SectionItemCreateDTO[];
}
