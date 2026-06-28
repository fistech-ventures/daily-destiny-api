import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialEventInternalController } from './controllers/internal/specialEvent.internal.controller';
import { SpecialEventWebController } from './controllers/web/specialEvent.web.controller';
import { SpecialEvent } from './entities/specialEvent.entity';
import { SpecialEventService } from './services/specialEvent.service';

const entities = [SpecialEvent];
const services = [SpecialEventService];
const webControllers = [SpecialEventWebController];
const internalControllers = [SpecialEventInternalController];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services],
  exports: [...services],
  controllers: [...webControllers, ...internalControllers],
})
export class SpecialEventModule {}
