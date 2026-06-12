import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { PollFilterDTO } from '../../dtos/poll/filter.dto';
import { Poll } from '../../entities/poll.entity';
import { PollService } from '../../services/poll.service';

@ApiTags('Poll')
@ApiBearerAuth()
@Controller('web/polls')
export class PollWebController {
  constructor(private readonly service: PollService) {}

  RELATIONS: FindOptionsRelations<Poll> = { options: true };

  @Public()
  @Get()
  async findAll(@Query() query: PollFilterDTO): Promise<SuccessResponse<Poll[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Poll> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  // @Post()
  // async createOne(@Body() body: PollCreateDTO): Promise<Poll> {
  //   return this.service.createOne(body, { relations: this.RELATIONS });
  // }

  // @Patch(':id')
  // async updateOne(
  //   @Param('id') id: string,
  //   @Body() body: PollUpdateDTO,
  // ): Promise<Poll> {
  //   return this.service.updateOne(id, body, { relations: this.RELATIONS });
  // }
}
