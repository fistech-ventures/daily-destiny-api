import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubCategoryCreateDTO {
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
    example: 'article position',
  })
  @IsOptional()
  readonly position!: number;

  @ApiProperty({
    type: String,
    required: true,
    example: 'category uuid',
  })
  @IsNotEmpty()
  readonly categoryId!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive!: boolean;
}
