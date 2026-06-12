import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorInternalController } from './controllers/internal/author.internal.controller';
import { Author } from './entities/author.entity';
import { AuthorService } from './services/author.service';

const entities = [Author];
const services = [AuthorService];
const subscribers = [];
const controllers = [];
const internalControllers = [AuthorInternalController];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services, ...subscribers],
  exports: [...services, ...subscribers],
  controllers: [...controllers, ...internalControllers],
})
export class AuthorModule {}
