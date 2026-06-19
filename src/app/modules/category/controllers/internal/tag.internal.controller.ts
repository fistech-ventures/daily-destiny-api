import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { TagCreateDTO, TagsUpsertBulkDTO } from '../../dtos/tag/create.dto';
import { TagFilterDTO } from '../../dtos/tag/filter.dto';
import { TagUpdateDTO } from '../../dtos/tag/update.dto';
import { Tag } from '../../entities/tag.entity';
import { TagService } from '../../services/tag.service';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('internal/tags')
export class TagInternalController {
  constructor(private readonly service: TagService) { }

  RELATIONS: FindOptionsRelations<Tag> = {};

  @Get()
  async findAll(@Query() query: TagFilterDTO): Promise<SuccessResponse<Tag[]>> {
    query['sortBy'] = 'article';
    query['sortOrder'] = 'desc';
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  // @Get(':id')
  // async findById(@Param('id') id: string): Promise<Tag> {
  //   return this.service.findByIdBase(id, { relations: this.RELATIONS });
  // }

  @Post()
  async createOne(@Body() body: TagCreateDTO): Promise<Tag> {
    return this.service.createOneBase(body, { relations: this.RELATIONS });
  }

  @Post('bulk-sync')
  async upsertBulkTags(@Body() body: TagsUpsertBulkDTO): Promise<SuccessResponse<Tag[]>> {
    return this.service.upsertBulkTags(body);
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: TagUpdateDTO): Promise<Tag> {
    return this.service.updateOneBase(id, body, { relations: this.RELATIONS });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }
}
