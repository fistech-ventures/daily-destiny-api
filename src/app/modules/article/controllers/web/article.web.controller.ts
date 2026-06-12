import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations, Raw } from 'typeorm';
import { ENUM_ARTICLE_STATUS } from '../../const';
import { ArticleFilterDTO } from '../../dtos/article/filter.dto';
import { Article } from '../../entities/article.entity';
import { ArticleService } from '../../services/article.service';

@ApiTags('Article')
@ApiBearerAuth()
@Controller('web/articles')
export class ArticleWebController {
  constructor(private readonly service: ArticleService) { }

  RELATIONS: FindOptionsRelations<Article> = { author: true, category: true, subCategory: true, medias: true, locations: { location: true } };

  @Public()
  @Get()
  async findAll(@Query() query: ArticleFilterDTO): Promise<SuccessResponse<Article[]>> {
    query['isActive'] = true;
    query['status'] = ENUM_ARTICLE_STATUS.PUBLISHED;

    // Handle location-based filtering
    if (query.divisionId || query.districtId || query.upazillaId || query.unionId || query.locationId) {
      const result = await this.service.findWithLocationFilter(query);
      return new SuccessResponse('Articles fetched successfully', result.data, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        skip: result.skip,
      });
    }

    if (query.topics?.length) {
      query['tags'] = Raw((alias) => `${alias} @> :tags`, {
        tags: JSON.stringify(query.topics),
      });
    }
    delete query?.topics
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
}
