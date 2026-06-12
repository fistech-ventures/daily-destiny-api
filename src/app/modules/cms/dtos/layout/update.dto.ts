import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateIf } from 'class-validator';
import { ENUM_LAYOUT_TYPE } from '../../const';

export class LayoutColumnUpdateDTO {
  @ApiProperty({
    type: Number,
    required: false,
    example: 2,
  })
  @IsOptional()
  position!: number;

  @ApiProperty({
    type: Number,
    required: false,
    example: 2,
  })
  @IsOptional()
  span!: number;

  @ApiProperty({
    type: String,
    required: false,
    example: Object.values(ENUM_LAYOUT_TYPE).join(' / '),
  })
  @IsOptional()
  readonly type!: string;

  @ApiProperty({
    type: [Object],
    required: false,
  })
  @IsOptional()
  readonly childrens!: any[];

  @ApiProperty({
    type: Boolean,
    required: false,
    example: false,
  })
  @IsOptional()
  isDeleted!: boolean;

  @ApiProperty({
    type: String,
    required: true,
    example: 'uuid',
  })
  @ValidateIf((o) => o.isDeleted)
  id!: string;
}

export class LayoutUpdateDTO {
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
    example: Object.values(ENUM_LAYOUT_TYPE).join(' / '),
  })
  @IsOptional()
  readonly type!: string;

  @ApiProperty({
    type: Number,
    required: false,
    example: 2,
  })
  @IsOptional()
  readonly position!: number;

  @ApiProperty({
    type: [LayoutColumnUpdateDTO],
    required: false,
  })
  @IsOptional()
  @Type(() => LayoutColumnUpdateDTO)
  readonly columns!: LayoutColumnUpdateDTO[];
}
