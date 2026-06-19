import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { SectionCreateDTO } from '../../dtos/section/create.dto';
import { SectionFilterDTO } from '../../dtos/section/filter.dto';
import { SectionUpdateDTO } from '../../dtos/section/update.dto';
import { Section } from '../../entities/section.entity';
import { SectionService } from '../../services/section.service';

@ApiTags('CMS#Section')
@ApiBearerAuth()
@Controller('internal/sections')
export class SectionInternalController {
  constructor(private readonly service: SectionService) { }

  RELATIONS: FindOptionsRelations<Section> = {};

  @Get()
  async findAll(@Query() query: SectionFilterDTO): Promise<SuccessResponse<Section[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Section> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: SectionCreateDTO): Promise<Section> {
    return this.service.createOne(body, { relations: this.RELATIONS });
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: SectionUpdateDTO): Promise<Section> {
    return this.service.updateOne(id, body, { relations: this.RELATIONS });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }
}
