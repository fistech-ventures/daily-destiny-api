import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { CategoryFilterDTO } from '../../dtos/category/filter.dto';
import { Category } from '../../entities/category.entity';
import { CategoryService } from '../../services/category.service';
import { Public } from '@src/app/decorators/publicRoute.decorator';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('web/categories')
export class CategoryWebController {
  constructor(private readonly service: CategoryService) {}

  RELATIONS: FindOptionsRelations<Category> = { subCategories: true };

  @Public()
  @Get()
  async findAll(@Query() query: CategoryFilterDTO): Promise<SuccessResponse<Category[]>> {
    query['isActive'] = true;
    query['sortBy'] = 'position';
    query['sortOrder'] = 'asc';
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Category> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }
}
