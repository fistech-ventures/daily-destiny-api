import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class RecordEventDTO {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Event type - must be "view" or "share"',
    example: 'view',
  })
  @IsIn(['view', 'share'])
  eventType!: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Optional session identifier to prevent duplicate counting',
  })
  @IsOptional()
  @IsString()
  sessionId?: string;
}
