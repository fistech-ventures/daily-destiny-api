import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ENUM_CONTENT_TYPE } from '../../const';

export class PageSectionCreateDTO {
  @ApiProperty({
    type: Number,
    required: false,
    example: 'the id of the section',
  })
  @IsOptional()
  @IsString()
  sectionId?: string;
}

export class PageCreateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'News Title',
  })
  @IsNotEmpty()
  @IsString()
  readonly title?: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'slugified-news-title',
  })
  @IsNotEmpty()
  readonly slug?: string;

  @ApiProperty({
    type: [Object],
    required: false,
    example: [{ ab: 'slugified-news-title' }],
  })
  @IsOptional()
  readonly layouts?: any[];

  @ApiProperty({
    type: String,
    required: false,
    example: Object.values(ENUM_CONTENT_TYPE).join(' / '),
  })
  @IsOptional()
  // @IsEnum(ENUM_CONTENT_TYPE)
  readonly contentType?: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @ApiProperty({
    type: [PageSectionCreateDTO],
    required: false,
  })
  // @IsArray()
  @IsOptional()
  // @ValidateNested()
  @Type(() => PageSectionCreateDTO)
  readonly sections?: PageSectionCreateDTO[];
}
