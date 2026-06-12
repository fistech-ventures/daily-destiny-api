import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { LayoutFilterDTO } from '../../dtos/layout/filter.dto';
import { Layout } from '../../entities/layout.entity';
import { LayoutService } from '../../services/layout.service';

@ApiTags('CMS#Layout')
@ApiBearerAuth()
@Controller('web/layouts')
export class LayoutWebController {
  constructor(private readonly service: LayoutService) {}

  RELATIONS: FindOptionsRelations<Layout> = { columns: true };

  @Public()
  @Get()
  async findAll(@Query() query: LayoutFilterDTO): Promise<SuccessResponse<Layout[]>> {
    query['isActive'] = true;
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }
}
