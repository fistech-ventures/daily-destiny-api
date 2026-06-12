import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { StartupCreateDTO, StartupFilterDTO, StartupUpdateDTO } from '../../dtos';
import { Startup } from '../../entities/startup.entity';
import { StartupService } from '../../services/startup.service';

@ApiTags('Startup')
@ApiBearerAuth()
@Controller('internal/startups')
export class StartupInternalController {
  constructor(private readonly service: StartupService) {}

  RELATIONS: FindOptionsRelations<Startup> = { founders: true };

  @Get()
  async findAll(@Query() query: StartupFilterDTO): Promise<SuccessResponse<Startup[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Startup> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: StartupCreateDTO): Promise<Startup> {
    return this.service.createOne(body, { relations: this.RELATIONS });
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: StartupUpdateDTO): Promise<Startup> {
    return this.service.updateOne(id, body, { relations: this.RELATIONS });
  }
}
