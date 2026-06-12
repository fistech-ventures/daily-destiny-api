import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { Repository } from 'typeorm';
import { MarketPrice } from '../entities/marketPrice.entity';

@Injectable()
export class MarketPriceService extends BaseService<MarketPrice> {
  constructor(
    @InjectRepository(MarketPrice)
    private readonly _repo: Repository<MarketPrice>,
  ) {
    super(_repo);
  }
}
