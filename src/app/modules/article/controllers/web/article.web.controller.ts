import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations, Raw } from 'typeorm';
import { ENUM_ARTICLE_STATUS } from '../../const';
import { ArticleFilterDTO } from '../../dtos/article/filter.dto';
import { RecordEventDTO } from '../../dtos/article/recordEvent.dto';
import { Article } from '../../entities/article.entity';
import { EventType } from '../../entities/articleEvent.entity';
import { ArticleService } from '../../services/article.service';
import { ArticlePopularityService } from '../../services/articlePopularity.service';

@ApiTags('Article')
@ApiBearerAuth()
@Controller('web/articles')
export class ArticleWebController {
  constructor(
    private readonly service: ArticleService,
    private readonly popularService: ArticlePopularityService,
  ) { }

  RELATIONS: FindOptionsRelations<Article> = { author: true, category: true, categories: true, subCategory: true, subCategories: true, medias: true, locations: { location: true } };

  @Public()
  @Get()
  async findAll(@Query() query: ArticleFilterDTO): Promise<SuccessResponse<Article[]>> {
    query['isActive'] = true;
    query['status'] = ENUM_ARTICLE_STATUS.PUBLISHED;

    // Handle date filtering (startDate / endDate / date)
    let startDate = (query as any).startDate;
    let endDate = (query as any).endDate;
    const date = (query as any).date;
    delete (query as any).startDate;
    delete (query as any).endDate;
    delete (query as any).date;

    // If single date is provided, convert to full day range (UTC, overrides startDate/endDate)
    if (date) {
      const startOfDay = new Date(date + 'T00:00:00.000Z');
      const endOfDay = new Date(date + 'T23:59:59.999Z');
      startDate = startOfDay.toISOString();
      endDate = endOfDay.toISOString();
    }

    // Handle location-based filtering
    if (query.divisionId || query.districtId || query.upazillaId || query.unionId || query.locationId) {
      query['_startDate'] = startDate;
      query['_endDate'] = endDate;
      const result = await this.service.findWithLocationFilter(query);
      return new SuccessResponse('Articles fetched successfully', result.data, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        skip: result.skip,
      });
    }

    // Handle popular articles filter
    if (query.isPopular === 'true') {
      query['_startDate'] = startDate;
      query['_endDate'] = endDate;
      const result = await this.service.findPopularArticles(query);
      return new SuccessResponse('Popular articles fetched successfully', result.data, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        skip: result.skip,
      });
    }

    // For the default findAllBase path, add createdAt Raw filter for date range
    if (startDate || endDate) {
      query['createdAt'] = Raw((alias) => {
        const parts: string[] = [];
        if (startDate) parts.push(`${alias} >= :startDate`);
        if (endDate) parts.push(`${alias} <= :endDate`);
        return parts.join(' AND ');
      }, {
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      });
    }

    if (query.topics?.length) {
      query['tags'] = Raw((alias) => `${alias} @> :tags`, {
        tags: JSON.stringify(query.topics),
      });
    }
    delete query?.topics

    // Handle categoryIds and subCategoryIds array filters via join tables (also check legacy columns)
    // Use a single Raw expression with both conditions to avoid overwriting
    // Capture values before deleting (Raw callback is lazily evaluated)
    const catIds = query.categoryIds;
    const subCatIds = query.subCategoryIds;
    delete (query as any).categoryIds;
    delete (query as any).subCategoryIds;

    if (catIds?.length || subCatIds?.length) {
      query['id'] = Raw((alias) => {
        const parts: string[] = [];
        if (catIds?.length) {
          // Use EXISTS subquery with actual table name to avoid entity alias ambiguity
          parts.push(`(${alias} IN (SELECT "articleId" FROM article_categories WHERE "categoryId" IN (:...categoryIds)) OR EXISTS (SELECT 1 FROM articles WHERE id = ${alias} AND "categoryId" IN (:...legacyCategoryIds)))`);
        }
        if (subCatIds?.length) {
          parts.push(`(${alias} IN (SELECT "articleId" FROM article_sub_categories WHERE "subCategoryId" IN (:...subCategoryIds)) OR EXISTS (SELECT 1 FROM articles WHERE id = ${alias} AND "subCategoryId" IN (:...legacySubCategoryIds)))`);
        }
        return parts.join(' OR ');
      }, {
        ...(catIds?.length && { categoryIds: catIds, legacyCategoryIds: catIds }),
        ...(subCatIds?.length && { subCategoryIds: subCatIds, legacySubCategoryIds: subCatIds }),
      });
    }

    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @ApiOperation({ deprecated: true })
  @Public()
  @Get('by-slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<Article> {
    return this.service.findOneBase(
      { slug, isActive: true, status: ENUM_ARTICLE_STATUS.PUBLISHED },
      { relations: this.RELATIONS },
    );
  }

  @Public()
  @Get('by-code/:code')
  async findByCode(@Param('code') code: string): Promise<Article> {
    return this.service.findOneBase(
      { code, isActive: true, status: ENUM_ARTICLE_STATUS.PUBLISHED },
      { relations: this.RELATIONS },
    );
  }

  @Public()
  @Get(':articleId/related')
  async findRelatedArticlesAndTopicById(@Param('articleId') articleId: string): Promise<SuccessResponse> {
    return this.service.findRelatedArticleAndTopicById(articleId);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Article> {
    return this.service.findOneBase(
      { id, isActive: true, status: ENUM_ARTICLE_STATUS.PUBLISHED },
      { relations: this.RELATIONS },
    );
  }

  @Public()
  @Post(':id/events')
  async recordEvent(
    @Param('id') id: string,
    @Body() body: RecordEventDTO,
  ): Promise<SuccessResponse> {
    await this.popularService.recordEvent(id, body.eventType as EventType, body.sessionId);
    return new SuccessResponse('Event recorded successfully');
  }
}
