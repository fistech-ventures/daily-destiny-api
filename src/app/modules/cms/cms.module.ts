import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroBannerInternalController } from './controllers/internal/heroBanner.internal.controller';
import { LayoutInternalController } from './controllers/internal/layout.internal.controller';
import { MenuInternalController } from './controllers/internal/menu.internal.controller';
import { PageInternalController } from './controllers/internal/page.internal.controller';
import { SectionInternalController } from './controllers/internal/section.internal.controller';
import { HeroBannerWebController } from './controllers/web/heroBanner.web.controller';
import { LayoutWebController } from './controllers/web/layout.web.controller';
import { MenuWebController } from './controllers/web/menu.web.controller';
import { PageWebController } from './controllers/web/page.web.controller';
import { SectionWebController } from './controllers/web/section.web.controller';
import { HeroBanner } from './entities/heroBanner.entity';
import { Layout } from './entities/layout.entity';
import { LayoutColumn } from './entities/layoutColumns.entity';
import { Menu } from './entities/menu.entity';
import { Page } from './entities/page.entity';
import { PageSection } from './entities/pageSection.entity';
import { Section } from './entities/section.entity';
import { SectionItem } from './entities/sectionItems.entity';
import { HeroBannerService } from './services/heroBanner.service';
import { LayoutService } from './services/layout.service';
import { LayoutColumnService } from './services/layoutColumn.service';
import { MenuService } from './services/menu.service';
import { PageService } from './services/page.service';
import { PageSectionService } from './services/pageSection.service';
import { SectionService } from './services/section.service';
import { SectionItemService } from './services/sectionItem.service';

const entities = [Menu, Page, Section, SectionItem, PageSection, Layout, LayoutColumn, HeroBanner];
const services = [
  MenuService,
  PageService,
  SectionService,
  SectionItemService,
  PageSectionService,
  LayoutService,
  LayoutColumnService,
  HeroBannerService,
];
const subscribers = [];
const internalControllers = [
  MenuInternalController,
  PageInternalController,
  SectionInternalController,
  LayoutInternalController,
  HeroBannerInternalController,
];
const webControllers = [
  MenuWebController,
  SectionWebController,
  PageWebController,
  LayoutWebController,
  HeroBannerWebController,
];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services, ...subscribers],
  exports: [...services, ...subscribers],
  controllers: [...webControllers, ...internalControllers],
})
export class CMSModule {}
