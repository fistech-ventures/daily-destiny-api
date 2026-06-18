import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { SubCategoryService } from '../../services/subCategory.service';
import { SubCategory } from '../../entities/subCategory.entity';
import { SubCategoryCreateDTO } from '../../dtos/subCategory/create.dto';
import { SubCategoryUpdateDTO } from '../../dtos/subCategory/update.dto';
import { SubCategoryFilterDTO } from '../../dtos/subCategory/filter.dto';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('internal/sub-categories')
export class SubCategoryInternalController {
  constructor(private readonly service: SubCategoryService) {}

  RELATIONS: FindOptionsRelations<SubCategory> = {};

  @Get()
  async findAll(@Query() query: SubCategoryFilterDTO): Promise<SuccessResponse<SubCategory[]>> {
    query['sortBy'] = 'position';
    query['sortOrder'] = 'asc';
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<SubCategory> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: SubCategoryCreateDTO): Promise<SubCategory> {
    return this.service.createOneBase(body, { relations: this.RELATIONS });
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: SubCategoryUpdateDTO): Promise<Category> {
    return this.service.updateOneBase(id, body, { relations: this.RELATIONS });
  }
}
