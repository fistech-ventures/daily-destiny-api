import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleInternalController } from './controllers/internal/article.internal.controller';
import { ArticleWebController } from './controllers/web/article.web.controller';
import { Article } from './entities/article.entity';
import { ArticleService } from './services/article.service';
import { ArticleTag } from './entities/articleTag.entity';
import { ArticleMedia } from './entities/articleMedia.entity';
import { ArticleMediaService } from './services/articleMedia.service';
import { ArticleLocation } from '../location/entities/articleLocation.entity';

const entities = [Article, ArticleTag, ArticleMedia, ArticleLocation];
const services = [ArticleService, ArticleMediaService];
const subscribers = [];
const webControllers = [ArticleWebController];
const internalControllers = [ArticleInternalController];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services, ...subscribers],
  exports: [...services, ...subscribers],
  controllers: [...webControllers, ...internalControllers],
})
export class ArticleModule { }
