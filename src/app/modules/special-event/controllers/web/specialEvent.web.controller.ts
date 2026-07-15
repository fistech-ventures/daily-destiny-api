import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { SuccessResponse } from '@src/app/types';
import { SpecialEventFilterDTO } from '../../dtos/filter.dto';
import { SpecialEvent } from '../../entities/specialEvent.entity';
import { SpecialEventService } from '../../services/specialEvent.service';

@ApiTags('Special Event')
@Controller('web/special-events')
export class SpecialEventWebController {
  constructor(private readonly service: SpecialEventService) { }

  RELATIONS = { articles: true };

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active special events' })
  async findAll(@Query() query: SpecialEventFilterDTO): Promise<SuccessResponse<SpecialEvent[]>> {
    query['isActive'] = 'true' as any;
    return this.service.findAllBase(query, {
      relations: this.RELATIONS, select: {
        id: true,
        title: true,
        slug: true,
        bannerImage: true,
        isActive: true,
        articles: {
          id: true,
          title: true,
          code: true,
          slug: true,
          excerpt: true,
          coverImage: true,
        }
      }
    });
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get a special event by slug' })
  async findBySlug(@Param('slug') slug: string): Promise<SpecialEvent> {
    return this.service.findOneBase(
      { slug, isActive: true } as SpecialEvent,
      { relations: this.RELATIONS },
    );
  }
}
