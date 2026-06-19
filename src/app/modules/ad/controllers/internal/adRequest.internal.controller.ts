import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { AdRequestCreateDTO } from '../../dtos/adRequest/create.dto';
import { AdRequestFilterDTO } from '../../dtos/adRequest/filter.dto';
import { AdRequestUpdateDTO } from '../../dtos/adRequest/update.dto';
import { AdRequest } from '../../entities/adRequest.entity';
import { AdRequestService } from '../../services/adRequest.service';

@ApiTags('Ad Request')
@ApiBearerAuth()
@Controller('internal/ad-requests')
export class AdRequestInternalController {
  constructor(private readonly service: AdRequestService) { }

  RELATIONS: FindOptionsRelations<AdRequest> = {};

  @Get()
  async findAll(@Query() query: AdRequestFilterDTO): Promise<SuccessResponse<AdRequest[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<AdRequest> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: AdRequestCreateDTO): Promise<AdRequest> {
    return this.service.createOneBase(body, { relations: this.RELATIONS });
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: AdRequestUpdateDTO): Promise<AdRequest> {
    return this.service.updateOneBase(id, body, { relations: this.RELATIONS });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }
}
