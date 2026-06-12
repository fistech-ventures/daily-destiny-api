import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { SubCategoryService } from '../../services/subCategory.service';
import { SubCategory } from '../../entities/subCategory.entity';
import { SubCategoryFilterDTO } from '../../dtos/subCategory/filter.dto';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('web/sub-categories')
export class SubCategoryWebController {
  constructor(private readonly service: SubCategoryService) {}

  RELATIONS: FindOptionsRelations<SubCategory> = {};

  @Public()
  @Get()
  async findAll(@Query() query: SubCategoryFilterDTO): Promise<SuccessResponse<SubCategory[]>> {
    query['isActive'] = true;
    query['sortBy'] = 'position';
    query['sortOrder'] = 'desc';
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string): Promise<SubCategory> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }
}
