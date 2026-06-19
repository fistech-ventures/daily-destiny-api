import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { AdCreateDTO } from '../../dtos/ad/create.dto';
import { AdFilterDTO } from '../../dtos/ad/filter.dto';
import { AdUpdateDTO } from '../../dtos/ad/update.dto';
import { Ad } from '../../entities/ad.entity';
import { AdService } from '../../services/ad.service';

@ApiTags('Ad')
@ApiBearerAuth()
@Controller('internal/ads')
export class AdInternalController {
  constructor(private readonly service: AdService) { }

  RELATIONS: FindOptionsRelations<Ad> = {};

  @Get()
  async findAll(@Query() query: AdFilterDTO): Promise<SuccessResponse<Ad[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Ad> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: AdCreateDTO): Promise<Ad> {
    return this.service.createOneBase(body, { relations: this.RELATIONS });
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: AdUpdateDTO): Promise<Ad> {
    return this.service.updateOneBase(id, body, { relations: this.RELATIONS });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }
}
