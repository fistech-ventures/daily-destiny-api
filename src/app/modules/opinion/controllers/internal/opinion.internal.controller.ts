import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { OpinionCreateDTO } from '../../dtos/opinion/create.dto';
import { OpinionFilterDTO } from '../../dtos/opinion/filter.dto';
import { OpinionUpdateDTO } from '../../dtos/opinion/update.dto';
import { Opinion } from '../../entities/opinion.entity';
import { OpinionService } from '../../services/opinion.service';

@ApiTags('Opinion')
@ApiBearerAuth()
@Controller('internal/opinions')
export class OpinionInternalController {
  constructor(private readonly service: OpinionService) { }
  RELATIONS: FindOptionsRelations<Opinion> = {};

  @Get()
  async findAll(@Query() query: OpinionFilterDTO): Promise<SuccessResponse<Opinion[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Opinion> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: OpinionCreateDTO): Promise<Opinion> {
    return this.service.createOneBase(body, { relations: this.RELATIONS });
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: OpinionUpdateDTO): Promise<Opinion> {
    return this.service.updateOneBase(id, body, { relations: this.RELATIONS });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }
}
