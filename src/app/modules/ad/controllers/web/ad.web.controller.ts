import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { AdFilterDTO } from '../../dtos/ad/filter.dto';
import { Ad } from '../../entities/ad.entity';
import { AdService } from '../../services/ad.service';

@ApiTags('Ad')
@ApiBearerAuth()
@Controller('web/ads')
export class AdWebController {
  constructor(private readonly service: AdService) {}

  RELATIONS: FindOptionsRelations<Ad> = {};

  @Public()
  @Get()
  async findAll(@Query() query: AdFilterDTO): Promise<SuccessResponse<Ad[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Public()
  @Get('/:id')
  async findById(@Param('id') id: string): Promise<Ad> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }
}
