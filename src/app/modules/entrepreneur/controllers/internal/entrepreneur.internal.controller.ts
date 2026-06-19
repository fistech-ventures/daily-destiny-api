import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { EntrepreneurCreateDTO, EntrepreneurFilterDTO, EntrepreneurUpdateDTO } from '../../dtos';
import { Entrepreneur } from '../../entities/entrepreneur.entity';
import { EntrepreneurService } from '../../services/entrepreneur.service';

@ApiTags('Entrepreneur')
@ApiBearerAuth()
@Controller('internal/entrepreneurs')
export class EntrepreneurInternalController {
  constructor(private readonly service: EntrepreneurService) { }

  RELATIONS: FindOptionsRelations<Entrepreneur> = {};

  @Get()
  async findAll(@Query() query: EntrepreneurFilterDTO): Promise<SuccessResponse<Entrepreneur[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Entrepreneur> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: EntrepreneurCreateDTO): Promise<Entrepreneur> {
    return this.service.createOneBase(body, { relations: this.RELATIONS });
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() body: EntrepreneurUpdateDTO,
  ): Promise<Entrepreneur> {
    return this.service.updateOneBase(id, body, { relations: this.RELATIONS });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }
}
