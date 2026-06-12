import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthorCreateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Ahmed Chofa',
  })
  @IsNotEmpty()
  @IsString()
  readonly name!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'আহমেদ ছফা',
  })
  @IsNotEmpty()
  @IsString()
  readonly nameBn!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'enews.com/author-image.jpg',
  })
  @IsOptional()
  @IsString()
  readonly image!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Stuff Reporter',
  })
  @IsOptional()
  readonly designation!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Stuff Reporter',
  })
  @IsOptional()
  readonly designationBn!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive!: boolean;
}
