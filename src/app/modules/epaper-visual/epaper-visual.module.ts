import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpaperVisualInternalController } from './controllers/internal/epaper-visual.internal.controller';
import { EpaperVisualWebController } from './controllers/web/epaper-visual.web.controller';
import { Edition } from './entities/edition.entity';
import { Hotspot } from './entities/hotspot.entity';
import { Page } from './entities/page.entity';
import { EpaperVisualService } from './services/epaper-visual.service';

const entities = [Edition, Page, Hotspot];
const services = [EpaperVisualService];
const webControllers = [EpaperVisualWebController];
const internalControllers = [EpaperVisualInternalController];

@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
  providers: [...services],
  exports: [...services],
  controllers: [...webControllers, ...internalControllers],
})
export class EpaperVisualModule {}
