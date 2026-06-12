import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdInternalController } from './controllers/internal/ad.internal.controller';
import { AdRequestInternalController } from './controllers/internal/adRequest.internal.controller';
import { AdWebController } from './controllers/web/ad.web.controller';
import { Ad } from './entities/ad.entity';
import { AdRequest } from './entities/adRequest.entity';
import { AdService } from './services/ad.service';
import { AdRequestService } from './services/adRequest.service';

const entities = [Ad, AdRequest];
const services = [AdService, AdRequestService];
const subscribers = [];
const webControllers = [AdWebController];
const internalControllers = [AdInternalController, AdRequestInternalController];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services, ...subscribers],
  exports: [...services, ...subscribers],
  controllers: [...webControllers, ...internalControllers],
})
export class AdModule {}
