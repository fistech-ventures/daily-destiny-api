import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TagCreateDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Family Card',
  })
  @IsNotEmpty()
  @IsString()
  readonly title!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive!: boolean;
}

export class TagsUpsertBulkDTO {
  @ApiProperty({
    type: [String],
    required: true,
    example: ['catalogs', 'create'],
  })
  @IsNotEmpty()
  @IsArray()
  readonly tags!: string[];

  @IsOptional()
  readonly createdBy?: any;
}