import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { MenuCreateDTO } from '../../dtos/menu/create.dto';
import { MenuFilterDTO } from '../../dtos/menu/filter.dto';
import { MenuUpdateDTO } from '../../dtos/menu/update.dto';
import { Menu } from '../../entities/menu.entity';
import { MenuService } from '../../services/menu.service';

@ApiTags('CMS#Menu')
@ApiBearerAuth()
@Controller('internal/menu')
export class MenuInternalController {
  constructor(private readonly service: MenuService) { }

  RELATIONS: FindOptionsRelations<Menu> = { parent: true };

  @Get()
  async findAll(@Query() query: MenuFilterDTO): Promise<SuccessResponse<Menu[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Menu> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: MenuCreateDTO): Promise<Menu> {
    return this.service.createOneBase(body, { relations: this.RELATIONS });
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: MenuUpdateDTO): Promise<Menu> {
    return this.service.updateOneBase(id, body, { relations: this.RELATIONS });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }
}
