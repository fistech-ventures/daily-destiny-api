import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

class CoordinatesDTO {
  @ApiProperty({ type: Number, required: true, example: 0.15, description: 'X position as a percentage (0-1)' })
  @IsNotEmpty()
  @IsNumber()
  readonly x!: number;

  @ApiProperty({ type: Number, required: true, example: 0.1, description: 'Y position as a percentage (0-1)' })
  @IsNotEmpty()
  @IsNumber()
  readonly y!: number;

  @ApiProperty({ type: Number, required: true, example: 0.3, description: 'Width as a percentage (0-1)' })
  @IsNotEmpty()
  @IsNumber()
  readonly width!: number;

  @ApiProperty({ type: Number, required: true, example: 0.25, description: 'Height as a percentage (0-1)' })
  @IsNotEmpty()
  @IsNumber()
  readonly height!: number;
}

class HotspotItemDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Lead Story',
    description: 'Optional label for the hot zone',
  })
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiProperty({
    type: CoordinatesDTO,
    required: true,
    description: 'Bounding box as percentages relative to the canvas',
  })
  @ValidateNested()
  @Type(() => CoordinatesDTO)
  readonly coordinates!: CoordinatesDTO;
}

export class SaveHotspotsDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'uuid-of-page',
    description: 'Page ID to attach hotspots to',
  })
  @IsNotEmpty()
  @IsUUID()
  readonly pageId!: string;

  @ApiProperty({
    type: [HotspotItemDTO],
    required: true,
    description: 'Array of hotspot configurations',
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HotspotItemDTO)
  readonly hotspots!: HotspotItemDTO[];
}
