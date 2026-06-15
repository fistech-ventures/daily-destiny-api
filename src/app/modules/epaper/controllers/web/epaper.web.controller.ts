import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { SuccessResponse } from '@src/app/types';
import { Epaper } from '../../entities/epaper.entity';
import { EpaperService } from '../../services/epaper.service';

@ApiTags('E-Paper - Public')
@Controller('web/epapers')
export class EpaperWebController {
  constructor(private readonly service: EpaperService) { }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active e-papers with filters' })
  async findAll(@Query() query: any): Promise<SuccessResponse<Epaper[]>> {
    query['isActive'] = true;
    return this.service.findAllBase(query);
  }

  @Public()
  @Get('publications')
  @ApiOperation({ summary: 'Get all publication names' })
  async getPublications(): Promise<string[]> {
    return this.service.getPublications();
  }

  @Public()
  @Get('dates')
  @ApiOperation({ summary: 'Get all available dates for e-papers' })
  async getAvailableDates(@Query('publicationName') publicationName?: string): Promise<Date[]> {
    return this.service.getAvailableDates(publicationName);
  }

  @Public()
  @Get('date-range')
  @ApiOperation({ summary: 'Get e-papers by date range' })
  async findByDateRange(
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('publicationName') publicationName?: string,
  ): Promise<SuccessResponse<Epaper[]>> {
    return this.service.findAllByDateRange(dateFrom, dateTo, publicationName);
  }

  @Public()
  @Get('pages/:date')
  @ApiOperation({ summary: 'Get all pages for a specific date' })
  async getPagesByDate(
    @Param('date') date: string,
    @Query('publicationName') publicationName?: string,
  ): Promise<Epaper[]> {
    return this.service.getPagesByDate(date, publicationName);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get e-paper by ID' })
  async findById(@Param('id') id: string): Promise<Epaper> {
    return this.service.findByIdBase(id);
  }
}
