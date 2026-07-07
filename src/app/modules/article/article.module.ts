import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleInternalController } from './controllers/internal/article.internal.controller';
import { ArticleWebController } from './controllers/web/article.web.controller';
import { Article } from './entities/article.entity';
import { ArticleService } from './services/article.service';
import { ArticleTag } from './entities/articleTag.entity';
import { ArticleMedia } from './entities/articleMedia.entity';
import { ArticleMediaService } from './services/articleMedia.service';
import { Category } from '../category/entities/category.entity';
import { SubCategory } from '../category/entities/subCategory.entity';
import { Author } from '../author/entities/author.entity';
import { ArticleLocation } from '../location/entities/articleLocation.entity';
import { ArticleEvent } from './entities/articleEvent.entity';
import { ArticlePopularity } from './entities/articlePopularity.entity';
import { ArticlePopularityService } from './services/articlePopularity.service';

const entities = [Article, ArticleTag, ArticleMedia, ArticleLocation, ArticleEvent, ArticlePopularity, Category, SubCategory, Author];
const services = [ArticleService, ArticleMediaService, ArticlePopularityService];
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
