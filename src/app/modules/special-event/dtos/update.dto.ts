import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class SpecialEventUpdateDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Eid Special Coverage',
  })
  @IsOptional()
  @IsString()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'eid-special-coverage',
  })
  @IsOptional()
  @IsString()
  readonly slug!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://cdn.example.com/banners/eid-special.jpg',
  })
  @IsOptional()
  @IsString()
  readonly bannerImage!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive!: boolean;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Array of article UUIDs to include in this event',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  readonly articleIds!: string[];
}
