import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryInternalController } from './controllers/internal/category.internal.controller';
import { Category } from './entities/category.entity';
import { CategoryService } from './services/category.service';
import { CategoryWebController } from './controllers/web/category.web.controller';
import { SubCategory } from './entities/subCategory.entity';
import { SubCategoryService } from './services/subCategory.service';
import { SubCategoryInternalController } from './controllers/internal/subCategory.internal.controller';
import { SubCategoryWebController } from './controllers/web/subCategory.web.controller';
import { Tag } from './entities/tag.entity';
import { TagService } from './services/tag.service';
import { TagInternalController } from './controllers/internal/tag.internal.controller';
import { TagWebController } from './controllers/web/tag.web.controller';
import { TagAlias } from './entities/tagAlias.entity';

const entities = [Category, SubCategory, Tag, TagAlias];
const services = [CategoryService, SubCategoryService, TagService];
const subscribers = [];
const controllers = [];
const internalControllers = [CategoryInternalController, SubCategoryInternalController, TagInternalController];
const webControllers = [CategoryWebController, SubCategoryWebController, TagWebController];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services, ...subscribers],
  exports: [...services, ...subscribers],
  controllers: [...controllers, ...internalControllers, ...webControllers],
})
export class CategoryModule {}
