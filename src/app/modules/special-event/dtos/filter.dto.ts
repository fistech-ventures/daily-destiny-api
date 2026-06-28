import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDTO } from '@src/app/base';
import { IsOptional, IsString } from 'class-validator';

export class SpecialEventFilterDTO extends BaseFilterDTO {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Search by event title',
  })
  @IsOptional()
  @IsString()
  readonly title!: string;
}
