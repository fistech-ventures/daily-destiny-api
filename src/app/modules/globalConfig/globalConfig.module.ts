import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalConfigInternalController } from './controllers/internal/globalConfig.internal.controller';
import { GlobalConfig } from './entities/globalConfig.entity';
import { GlobalConfigService } from './services/globalConfig.service';
import { GlobalConfigWebController } from './controllers/web/globalConfig.web.controller';

const entities = [GlobalConfig];
const services = [GlobalConfigService];
const subscribers = [];
const internalControllers = [GlobalConfigInternalController];
const webControllers = [GlobalConfigWebController];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services, ...subscribers],
  exports: [...services, ...subscribers],
  controllers: [...webControllers, ...internalControllers],
})
export class GlobalConfigModule { }
