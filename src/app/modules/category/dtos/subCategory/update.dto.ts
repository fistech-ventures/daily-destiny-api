import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SubCategoryUpdateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Politics',
  })
  @IsOptional()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Politics',
  })
  @IsOptional()
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
    required: false,
    example: 'category uuid',
  })
  @IsOptional()
  readonly categoryId!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  readonly isActive!: boolean;
}
