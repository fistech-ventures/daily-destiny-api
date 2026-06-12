import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { CategoryCreateDTO } from '../../dtos/category/create.dto';
import { CategoryFilterDTO } from '../../dtos/category/filter.dto';
import { CategoryUpdateDTO } from '../../dtos/category/update.dto';
import { Category } from '../../entities/category.entity';
import { CategoryService } from '../../services/category.service';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('internal/categories')
export class CategoryInternalController {
  constructor(private readonly service: CategoryService) {}

  RELATIONS: FindOptionsRelations<Category> = {};

  @Get()
  async findAll(@Query() query: CategoryFilterDTO): Promise<SuccessResponse<Category[]>> {
    query['sortBy'] = 'position';
    query['sortOrder'] = 'desc';
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Category> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: CategoryCreateDTO): Promise<Category> {
    return this.service.createOne(body);
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: CategoryUpdateDTO): Promise<Category> {
    return this.service.updateOne(id, body);
  }
}
