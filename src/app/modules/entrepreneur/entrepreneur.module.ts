import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntrepreneurInternalController } from './controllers/internal/entrepreneur.internal.controller';
import { StartupInternalController } from './controllers/internal/startup.internal.controller';
import { Entrepreneur } from './entities/entrepreneur.entity';
import { Startup } from './entities/startup.entity';
import { StartupFounder } from './entities/startupFounders.entity';
import { EntrepreneurService } from './services/entrepreneur.service';
import { StartupService } from './services/startup.service';
import { StartupFounderService } from './services/startupFounder.service';

const entities = [Entrepreneur, Startup, StartupFounder];
const services = [EntrepreneurService, StartupService, StartupFounderService];
const subscribers = [];
const controllers = [];
const internalControllers = [EntrepreneurInternalController, StartupInternalController];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services, ...subscribers],
  exports: [...services, ...subscribers],
  controllers: [...controllers, ...internalControllers],
})
export class EntrepreneurModule {}
