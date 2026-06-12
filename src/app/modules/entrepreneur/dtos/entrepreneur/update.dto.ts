import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class EntrepreneurUpdateDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Ahmed Chofa',
  })
  @IsOptional()
  readonly name!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'fibonaccibooks.com/author-image.jpg',
  })
  @IsOptional()
  readonly image!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Stuff Reporter',
  })
  @IsOptional()
  readonly designation!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  readonly isActive!: boolean;
}
