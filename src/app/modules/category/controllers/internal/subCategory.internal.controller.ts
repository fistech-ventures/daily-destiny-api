import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { SubCategoryCreateDTO } from '../../dtos/subCategory/create.dto';
import { SubCategoryFilterDTO } from '../../dtos/subCategory/filter.dto';
import { SubCategoryUpdateDTO } from '../../dtos/subCategory/update.dto';
import { Category } from '../../entities/category.entity';
import { SubCategory } from '../../entities/subCategory.entity';
import { SubCategoryService } from '../../services/subCategory.service';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('internal/sub-categories')
export class SubCategoryInternalController {
  constructor(private readonly service: SubCategoryService) { }

  RELATIONS: FindOptionsRelations<SubCategory> = { category: true };

  @Get()
  async findAll(@Query() query: SubCategoryFilterDTO): Promise<SuccessResponse<SubCategory[]>> {
    query['sortBy'] = 'position';
    query['sortOrder'] = 'asc';
    return this.service.findAllBase(query, {
      relations: this.RELATIONS,
      select: {
        id: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        title: true,
        titleBn: true,
        slug: true,
        slugBn: true,
        position: true,
        article: true,
        categoryId: true,
        category: {
          id: true,
          title: true,
          titleBn: true,
        }
      }
    });
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

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }
}
