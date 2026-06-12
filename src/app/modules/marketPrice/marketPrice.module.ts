import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketPriceInternalController } from './controllers/internal/marketPrice.internal.controller';
import { MarketPrice } from './entities/marketPrice.entity';
import { MarketPriceService } from './services/marketPrice.service';
import { MarketPriceWebController } from './controllers/web/marketPrice.web.controller';

const entities = [MarketPrice];
const services = [MarketPriceService];
const subscribers = [];
const controllers = [];
const internalControllers = [MarketPriceInternalController];
const webControllers = [MarketPriceWebController];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services, ...subscribers],
  exports: [...services, ...subscribers],
  controllers: [...controllers, ...internalControllers, ...webControllers],
})
export class MarketPriceModule {}
