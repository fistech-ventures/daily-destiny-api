import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@src/app/decorators';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { EpaperCreateDTO, EpaperFilterDTO, EpaperUpdateDTO } from '../../dtos';
import { Epaper } from '../../entities/epaper.entity';
import { EpaperService } from '../../services/epaper.service';

@ApiTags('E-Paper')
@ApiBearerAuth()
@Controller('internal/epapers')
export class EpaperInternalController {
  constructor(private readonly service: EpaperService) { }

  @Get()
  @ApiOperation({ summary: 'Get all e-papers with filters' })
  async findAll(@Query() query: EpaperFilterDTO): Promise<SuccessResponse<Epaper[]>> {
    return this.service.findAllBase(query);
  }

  @Get('publications')
  @ApiOperation({ summary: 'Get all publication names' })
  async getPublications(): Promise<string[]> {
    return this.service.getPublications();
  }

  @Get('dates')
  @ApiOperation({ summary: 'Get all available dates for e-papers' })
  async getAvailableDates(@Query('publicationName') publicationName?: string): Promise<Date[]> {
    return this.service.getAvailableDates(publicationName);
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Get e-papers by date range' })
  async findByDateRange(
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('publicationName') publicationName?: string,
  ): Promise<SuccessResponse<Epaper[]>> {
    return this.service.findAllByDateRange(dateFrom, dateTo, publicationName);
  }

  @Get('pages/:date')
  @ApiOperation({ summary: 'Get all pages for a specific date' })
  async getPagesByDate(
    @Param('date') date: string,
    @Query('publicationName') publicationName?: string,
  ): Promise<Epaper[]> {
    return this.service.getPagesByDate(date, publicationName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get e-paper by ID' })
  async findById(@Param('id') id: string): Promise<Epaper> {
    return this.service.findByIdBase(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new e-paper' })
  async createOne(
    @Body() body: EpaperCreateDTO,
    @AuthUser() authUser: IAuthUser,
  ): Promise<Epaper> {
    return this.service.createOne(body, authUser);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an e-paper' })
  async updateOne(
    @Param('id') id: string,
    @Body() body: EpaperUpdateDTO,
    @AuthUser() authUser: IAuthUser,
  ): Promise<Epaper> {
    return this.service.updateOne(id, body, authUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an e-paper' })
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }
}
