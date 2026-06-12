import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionInternalController } from './controllers/internal/opinion.internal.controller';
import { PollInternalController } from './controllers/internal/poll.internal.controller';
import { OpinionWebController } from './controllers/web/opinion.web.controller';
import { PollWebController } from './controllers/web/poll.web.controller';
import { Opinion } from './entities/opinion.entity';
import { Poll } from './entities/poll.entity';
import { PollOption } from './entities/pollOption.entity';
import { OpinionService } from './services/opinion.service';
import { PollService } from './services/poll.service';
import { PollOptionService } from './services/pollOption.service';

const entities = [Opinion, Poll, PollOption];
const services = [OpinionService, PollService, PollOptionService];
const subscribers = [];
const webControllers = [OpinionWebController, PollWebController];
const internalControllers = [OpinionInternalController, PollInternalController];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services, ...subscribers],
  exports: [...services, ...subscribers],
  controllers: [...webControllers, ...internalControllers],
})
export class OpinionModule {}
