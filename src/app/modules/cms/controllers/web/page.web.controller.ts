import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { FindOptionsRelations } from 'typeorm';
import { Page } from '../../entities/page.entity';
import { PageService } from '../../services/page.service';

@ApiTags('CMS#Page')
@ApiBearerAuth()
@Controller('web/pages')
export class PageWebController {
  constructor(private readonly service: PageService) {}

  RELATIONS: FindOptionsRelations<Page> = {
    sections: { section: { items: { article: true, ad: true } } },
  };

  @Public()
  @Get('by-slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<Page> {
    return this.service.findOneBase({ slug }, { relations: this.RELATIONS });
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Page> {
    return this.service.findOneBase({ id, isActive: true }, { relations: this.RELATIONS });
  }
}
