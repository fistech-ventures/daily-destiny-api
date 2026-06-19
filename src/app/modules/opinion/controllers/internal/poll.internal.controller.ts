import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { PollCreateDTO } from '../../dtos/poll/create.dto';
import { PollFilterDTO } from '../../dtos/poll/filter.dto';
import { PollUpdateDTO } from '../../dtos/poll/update.dto';
import { Poll } from '../../entities/poll.entity';
import { PollService } from '../../services/poll.service';

@ApiTags('Poll')
@ApiBearerAuth()
@Controller('internal/polls')
export class PollInternalController {
  constructor(private readonly service: PollService) { }

  RELATIONS: FindOptionsRelations<Poll> = { options: true, author: true };

  @Get()
  async findAll(@Query() query: PollFilterDTO): Promise<SuccessResponse<Poll[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Poll> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: PollCreateDTO): Promise<Poll> {
    return this.service.createOne(body, { relations: this.RELATIONS });
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: PollUpdateDTO): Promise<Poll> {
    return this.service.updateOne(id, body, { relations: this.RELATIONS });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }
}
