import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ENUM_LANGUAGE } from '../../const';

export class MenuFilterDTO {
  @ApiProperty({
    type: Number,
    description: 'The page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  readonly page: number = 1;

  @ApiProperty({
    type: Number,
    description: 'Limit the number of results',
    example: 10,
    required: false,
  })
  @IsOptional()
  readonly limit: number = 10;

  @ApiProperty({
    type: String,
    description: 'The search term',
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly searchTerm!: string;

  @ApiProperty({
    type: String,
    description: Object.values(ENUM_LANGUAGE).join(' / '),
    example: '',
    required: false,
  })
  @IsOptional()
  readonly language!: string;

  @ApiProperty({
    type: Boolean,
    example: '',
    required: false,
  })
  @IsOptional()
  isActive!: boolean;

  @ApiProperty({
    type: String,
    required: false,
    description: 'page uuid',
  })
  @IsOptional()
  readonly pageId!: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'parent menu uuid',
  })
  @IsOptional()
  readonly parentId!: string;
}
