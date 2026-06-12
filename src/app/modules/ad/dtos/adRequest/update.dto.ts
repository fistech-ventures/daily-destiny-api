import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AdRequestUpdateDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Jahad Chaw',
  })
  @IsOptional()
  readonly contactName!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Jahad Chaw',
  })
  @IsOptional()
  readonly contactNo!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Jahad Chaw',
  })
  @IsOptional()
  readonly contactEmail!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'free/paid',
  })
  @IsOptional()
  readonly type!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'news details from rich text editor',
  })
  @IsOptional()
  readonly description!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://en.com/article-x-cover.png',
  })
  @IsOptional()
  readonly assets!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2025-05-30',
  })
  @IsOptional()
  readonly startDate!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2025-05-30',
  })
  @IsOptional()
  readonly endDate!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 2500,
  })
  @IsOptional()
  readonly billAmount!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 1500,
  })
  @IsOptional()
  readonly paidAmount!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 1000,
  })
  @IsOptional()
  readonly dueAmount!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  readonly isActive!: boolean;

  @ApiProperty({
    type: String,
    required: false,
    example: 'approved/declined/completed',
  })
  @IsOptional()
  readonly status!: string;
}
