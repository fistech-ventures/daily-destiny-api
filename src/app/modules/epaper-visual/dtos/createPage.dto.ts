import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePageDTO {
  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
    description: 'Page number (e.g., 1, 2, 3)',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly pageNumber!: number;

  @ApiProperty({
    type: String,
    required: true,
    example: 'https://cdn.example.com/epaper/2024-06-16/page-1.webp',
    description: 'URL pointing to the optimized WebP page image',
  })
  @IsNotEmpty()
  @IsString()
  readonly imageUrl!: string;
}
