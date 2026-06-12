import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@src/app/decorators';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations, Raw } from 'typeorm';
import { ArticleCreateDTO } from '../../dtos/article/create.dto';
import { ArticleFilterDTO } from '../../dtos/article/filter.dto';
import { ArticleUpdateDTO } from '../../dtos/article/update.dto';
import { Article } from '../../entities/article.entity';
import { ArticleService } from '../../services/article.service';

@ApiTags('Article')
@ApiBearerAuth()
@Controller('internal/articles')
export class ArticleInternalController {
  constructor(private readonly service: ArticleService) { }

  RELATIONS: FindOptionsRelations<Article> = { author: true, category: true, subCategory: true, medias: true, locations: { location: true } };

  @Get()
  async findAll(@Query() query: ArticleFilterDTO): Promise<SuccessResponse<Article[]>> {
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
}
