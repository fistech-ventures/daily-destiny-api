import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdRequestCreateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Jahad Chaw',
  })
  @IsNotEmpty()
  @IsString()
  readonly contactName!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Jahad Chaw',
  })
  @IsNotEmpty()
  @IsString()
  readonly contactNo!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Jahad Chaw',
  })
  @IsNotEmpty()
  @IsString()
  readonly contactEmail!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'news details from rich text editor',
  })
  @IsNotEmpty()
  readonly description!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'https://en.com/article-x-cover.png',
  })
  @IsNotEmpty()
  readonly assets!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '2025-05-30',
  })
  @IsNotEmpty()
  readonly startDate!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '2025-05-30',
  })
  @IsNotEmpty()
  readonly endDate!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive!: boolean;
}
