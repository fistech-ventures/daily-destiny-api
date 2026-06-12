import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CategoryCreateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Politics',
  })
  @IsNotEmpty()
  @IsString()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Politics',
  })
  @IsNotEmpty()
  @IsString()
  readonly titleBn!: string;

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
    example: 'Stuff Reporter',
  })
  @IsOptional()
  readonly slugBn!: string;

  @ApiProperty({
    type: Number,
    required: false,
    example: 'category position',
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

  @ApiProperty({
    type: String,
    required: true,
    example: 'category title',
  })
  @IsOptional()
  readonly metaTitle!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'category short description',
  })
  @IsOptional()
  readonly metaDescription!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'custom category preview image',
  })
  @IsOptional()
  readonly metaImage!: string;

  @ApiProperty({
    type: [String],
    required: false,
    example: ['politics', 'news', 'bengali'],
  })
  @IsOptional()
  readonly metaKeywords!: string[];
}
