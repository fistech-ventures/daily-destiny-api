import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { Edition } from '../../entities/edition.entity';
import { EpaperVisualService } from '../../services/epaper-visual.service';

@ApiTags('E-Paper Visual - Public')
@Controller('web/epaper-visual')
export class EpaperVisualWebController {
  constructor(private readonly service: EpaperVisualService) {}

  @Public()
  @Get('editions/latest')
  @ApiOperation({ summary: 'Get the latest published edition with all pages and hotspots' })
  async findLatest(): Promise<Edition> {
    return this.service.findLatestPublished();
  }

  @Public()
  @Get('editions/:date')
  @ApiOperation({ summary: 'Get a specific edition by date (YYYY-MM-DD) with all pages and hotspots' })
  async findByDate(@Param('date') date: string): Promise<Edition> {
    return this.service.findByDate(date);
  }
}
