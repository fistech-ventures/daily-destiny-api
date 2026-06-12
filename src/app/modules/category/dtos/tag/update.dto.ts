import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class TagUpdateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Politics',
  })
  @IsOptional()
  readonly title!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  readonly isActive!: boolean;
}
