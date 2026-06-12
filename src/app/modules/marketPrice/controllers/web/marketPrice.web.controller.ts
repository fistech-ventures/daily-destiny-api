import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { MarketPriceFilterDTO } from '../../dtos/filter.dto';
import { MarketPrice } from '../../entities/marketPrice.entity';
import { MarketPriceService } from '../../services/marketPrice.service';

@ApiTags('Market Price')
@ApiBearerAuth()
@Controller('web/market-prices')
export class MarketPriceWebController {
  constructor(private readonly service: MarketPriceService) { }
  RELATIONS: FindOptionsRelations<MarketPrice> = {};

  @Public()
  @Get()
  async findAll(@Query() query: MarketPriceFilterDTO): Promise<SuccessResponse<any>> {
    query['isActive'] = true;
    return this.service.findAllBase(query)
  }
}
