import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@src/app/decorators';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations, Raw } from 'typeorm';
import { ArticleCreateDTO } from '../../dtos/article/create.dto';
import { ArticleFilterDTO } from '../../dtos/article/filter.dto';
import { ArticleUpdateDTO } from '../../dtos/article/update.dto';
import { Article } from '../../entities/article.entity';
import { ArticleService } from '../../services/article.service';
import { ArticlePopularityService } from '../../services/articlePopularity.service';

@ApiTags('Article')
@ApiBearerAuth()
@Controller('internal/articles')
export class ArticleInternalController {
  constructor(
    private readonly service: ArticleService,
    private readonly popularService: ArticlePopularityService,
  ) { }

  RELATIONS: FindOptionsRelations<Article> = { author: true, category: true, subCategory: true, medias: true, locations: { location: true } };

  @Get()
  async findAll(@Query() query: ArticleFilterDTO): Promise<SuccessResponse<Article[]>> {
    // Handle date range filtering (startDate / endDate)
    const startDate = (query as any).startDate;
    const endDate = (query as any).endDate;
    delete (query as any).startDate;
    delete (query as any).endDate;

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
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Article> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: ArticleCreateDTO, @AuthUser() authUser: IAuthUser): Promise<Article> {
    return this.service.createOne(body, authUser);
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: ArticleUpdateDTO, @AuthUser() authUser: IAuthUser): Promise<Article> {
    return this.service.updateOne(id, body, authUser);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }

  @Public()
  @Post('popularity/compute')
  async computePopularity(): Promise<SuccessResponse> {
    await this.popularService.computePopularityScores();
    return new SuccessResponse('Popularity scores computed successfully');
  }
}
