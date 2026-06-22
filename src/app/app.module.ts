import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '@src/database/database.module';
import { ExceptionFilter } from './filters';
import { HelpersModule } from './helpers/helpers.module';
import { GlobalRequestInterceptor, ResponseInterceptor } from './interceptors';
import { AclModule } from './modules/acl/acl.module';
import { AdModule } from './modules/ad/ad.module';
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/guards/local-auth.guard';
import { AuthorModule } from './modules/author/author.module';
import { CategoryModule } from './modules/category/category.module';
import { CMSModule } from './modules/cms/cms.module';
import { CommonModule } from './modules/common/common.module';
import { EntrepreneurModule } from './modules/entrepreneur/entrepreneur.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { LocationModule } from './modules/location/location.module';
import { MarketPriceModule } from './modules/marketPrice/marketPrice.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OpinionModule } from './modules/opinion/opinion.module';
import { UserModule } from './modules/user/user.module';
import { UniqueValidatorPipe } from './pipes/uniqueValidator.pipe';
import { EpaperModule } from './modules/epaper/epaper.module';
import { EpaperVisualModule } from './modules/epaper-visual/epaper-visual.module';

const MODULES = [
  DatabaseModule,
  HelpersModule,
  ScheduleModule.forRoot(),
  AuthModule,
  GalleryModule,
  AclModule,
  UserModule,
  CommonModule,
  NotificationModule,
  AuthorModule,
  CategoryModule,
  LocationModule,
  ArticleModule,
  OpinionModule,
  EntrepreneurModule,
  CMSModule,
  AdModule,
  MarketPriceModule,
  EpaperModule,
  EpaperVisualModule,
];
const PIPES = [UniqueValidatorPipe];

@Module({
  imports: [...MODULES],
  controllers: [],
  providers: [
    ...PIPES,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalRequestInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule { }
