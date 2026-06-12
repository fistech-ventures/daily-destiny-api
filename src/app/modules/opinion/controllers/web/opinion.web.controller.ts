import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { OpinionFilterDTO } from '../../dtos/opinion/filter.dto';
import { Opinion } from '../../entities/opinion.entity';
import { OpinionService } from '../../services/opinion.service';

@ApiTags('Opinion')
@ApiBearerAuth()
@Controller('web/opinions')
export class OpinionWebController {
  constructor(private readonly service: OpinionService) {}
  RELATIONS: FindOptionsRelations<Opinion> = {};

  @Public()
  @Get()
  async findAll(@Query() query: OpinionFilterDTO): Promise<SuccessResponse<Opinion[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  // @Get(':id')
  // async findById(@Param('id') id: string): Promise<Opinion> {
  //   return this.service.findByIdBase(id, { relations: this.RELATIONS });
  // }

  // @Post()
  // async createOne(@Body() body: OpinionCreateDTO): Promise<Opinion> {
  //   return this.service.createOneBase(body, { relations: this.RELATIONS });
  // }

  // @Patch(':id')
  // async updateOne(
  //   @Param('id') id: string,
  //   @Body() body: OpinionUpdateDTO,
  // ): Promise<Opinion> {
  //   return this.service.updateOneBase(id, body, { relations: this.RELATIONS });
  // }
}
