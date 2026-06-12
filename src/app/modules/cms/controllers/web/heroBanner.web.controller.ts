import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FindOptionsRelations } from 'typeorm';
import { HeroBannerFilterDTO } from '../../dtos/heroBanner/filter.dto';
import { HeroBanner } from '../../entities/heroBanner.entity';
import { HeroBannerService } from '../../services/heroBanner.service';

@ApiTags('CMS#HeroBanner')
@ApiBearerAuth()
@Controller('web/hero-banners')
export class HeroBannerWebController {
  constructor(private readonly service: HeroBannerService) {}

  RELATIONS: FindOptionsRelations<HeroBanner> = {};

  @Get()
  async findAll(@Query() query: HeroBannerFilterDTO): Promise<SuccessResponse<HeroBanner[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get('by-slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<HeroBanner> {
    return this.service.findOneBase({ slug }, { relations: this.RELATIONS });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<HeroBanner> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }
}
