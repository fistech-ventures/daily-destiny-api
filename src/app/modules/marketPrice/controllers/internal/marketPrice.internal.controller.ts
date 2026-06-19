import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { MarketPriceCreateDTO } from '../../dtos/create.dto';
import { MarketPriceFilterDTO } from '../../dtos/filter.dto';
import { MarketPriceUpdateDTO } from '../../dtos/update.dto';
import { MarketPrice } from '../../entities/marketPrice.entity';
import { MarketPriceService } from '../../services/marketPrice.service';

@ApiTags('Market Price')
@ApiBearerAuth()
@Controller('internal/market-prices')
export class MarketPriceInternalController {
  constructor(private readonly service: MarketPriceService) { }

  RELATIONS: FindOptionsRelations<MarketPrice> = {};

  @Get()
  async findAll(@Query() query: MarketPriceFilterDTO): Promise<SuccessResponse<MarketPrice[]>> {
    query['isActive'] = true;
    query['sortBy'] = 'position';
    query['sortOrder'] = 'asc';
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<MarketPrice> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: MarketPriceCreateDTO): Promise<MarketPrice> {
    return this.service.createOneBase(body, { relations: this.RELATIONS });
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: MarketPriceUpdateDTO): Promise<MarketPrice> {
    return this.service.updateOneBase(id, body, { relations: this.RELATIONS });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }
}
