import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ENUM_LAYOUT_TYPE } from '../../const';

export class LayoutColumnCreateDTO {
  @ApiProperty({
    type: Number,
    required: false,
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  position!: number;

  @ApiProperty({
    type: Number,
    required: false,
    example: 2,
  })
  @IsOptional()
  @IsNumber()
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
}

export class LayoutCreateDTO {
  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
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
    type: [LayoutColumnCreateDTO],
    required: false,
  })
  @IsOptional()
  @Type(() => LayoutColumnCreateDTO)
  readonly columns!: LayoutColumnCreateDTO[];
}
