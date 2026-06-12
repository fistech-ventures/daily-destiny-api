import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { MenuFilterDTO } from '../../dtos/menu/filter.dto';
import { Menu } from '../../entities/menu.entity';
import { MenuService } from '../../services/menu.service';

@ApiTags('CMS#Menu')
@ApiBearerAuth()
@Controller('web/menu')
export class MenuWebController {
  constructor(private readonly service: MenuService) {}

  RELATIONS: FindOptionsRelations<Menu> = { parent: true };

  @Public()
  @Get()
  async findAll(@Query() query: MenuFilterDTO): Promise<SuccessResponse<Menu[]>> {
    query['isActive'] = true;
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }
}
