import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { asyncForEach } from '@src/shared';
import { FindOptionsRelations } from 'typeorm';
import { LayoutCreateDTO } from '../../dtos/layout/create.dto';
import { LayoutFilterDTO } from '../../dtos/layout/filter.dto';
import { LayoutUpdateDTO } from '../../dtos/layout/update.dto';
import { Layout } from '../../entities/layout.entity';
import { LayoutService } from '../../services/layout.service';

@ApiTags('CMS#Layout')
@ApiBearerAuth()
@Controller('internal/layouts')
export class LayoutInternalController {
  constructor(private readonly service: LayoutService) {}

  RELATIONS: FindOptionsRelations<Layout> = { columns: true };

  @Get()
  async findAll(@Query() query: LayoutFilterDTO): Promise<SuccessResponse<Layout[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Layout> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: LayoutCreateDTO): Promise<Layout> {
    return this.service.createOne(body, { relations: this.RELATIONS });
  }

  @Post('bulk')
  async createBulk(@Body() body: [LayoutCreateDTO]): Promise<Layout[]> {
    const createRes = [];
    await asyncForEach(body, async (d) => {
      const created = await this.service.createOne(d, { relations: this.RELATIONS });
      createRes.push(created);
    });
    return createRes;
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: LayoutUpdateDTO): Promise<Layout> {
    return this.service.updateOne(id, body, { relations: this.RELATIONS });
  }
}
