import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location, ArticleLocation } from './entities';
import { LocationService } from './services/location.service';
import { LocationInternalController } from './controllers/location.internal.controller';
import { LocationWebController } from './controllers/location.web.controller';

const entities = [Location, ArticleLocation];
const services = [LocationService];
const internalControllers = [LocationInternalController];
const webControllers = [LocationWebController];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services],
  exports: [...services],
  controllers: [...internalControllers, ...webControllers],
})
export class LocationModule {}
