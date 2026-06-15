import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpaperInternalController } from './controllers/internal/epaper.internal.controller';
import { EpaperWebController } from './controllers/web/epaper.web.controller';
import { Epaper } from './entities/epaper.entity';
import { EpaperService } from './services/epaper.service';

const entities = [Epaper];
const services = [EpaperService];
const webControllers = [EpaperWebController];
const internalControllers = [EpaperInternalController];

@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
  providers: [...services],
  exports: [...services],
  controllers: [...webControllers, ...internalControllers],
})
export class EpaperModule {}
