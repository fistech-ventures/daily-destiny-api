import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@src/app/decorators';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { CreateEditionDTO } from '../../dtos/createEdition.dto';
import { CreatePageDTO } from '../../dtos/createPage.dto';
import { EditionFilterDTO } from '../../dtos/editionFilter.dto';
import { SaveHotspotsDTO } from '../../dtos/saveHotspots.dto';
import { Edition } from '../../entities/edition.entity';
import { Hotspot } from '../../entities/hotspot.entity';
import { Page } from '../../entities/page.entity';
import { EpaperVisualService } from '../../services/epaper-visual.service';

@ApiTags('E-Paper Visual')
@ApiBearerAuth()
@Controller('internal/epaper-visual')
export class EpaperVisualInternalController {
  constructor(private readonly service: EpaperVisualService) {}

  @Get('editions')
  @ApiOperation({ summary: 'Get all editions with filters' })
  async findAllEditions(@Query() query: EditionFilterDTO): Promise<SuccessResponse<Edition[]>> {
    return (this.service as any).findAllBase(query, { relations: { pages: { hotspots: true } } });
  }

  @Get('editions/:id')
  @ApiOperation({ summary: 'Get an edition by ID with pages and hotspots' })
  async findEditionById(@Param('id') id: string): Promise<Edition> {
    return this.service.findByIdWithRelations(id);
  }

  @Post('editions')
  @ApiOperation({ summary: 'Create a new daily edition' })
  async createEdition(
    @Body() body: CreateEditionDTO,
    @AuthUser() authUser: IAuthUser,
  ): Promise<Edition> {
    return this.service.createEdition(body, authUser);
  }

  @Patch('editions/:id/publish')
  @ApiOperation({ summary: 'Publish an edition (change status to published)' })
  async publishEdition(
    @Param('id') id: string,
    @AuthUser() authUser: IAuthUser,
  ): Promise<Edition> {
    await this.service.updateOneBase(id, {
      status: 'published',
      updatedBy: authUser,
    } as any);
    return this.service.findByIdWithRelations(id);
  }

  @Delete('editions/:id')
  @ApiOperation({ summary: 'Delete an edition and all its pages and hotspots' })
  async deleteEdition(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOne(id);
  }

  @Post('editions/:editionId/pages')
  @ApiOperation({ summary: 'Add a page to an edition' })
  async addPage(
    @Param('editionId') editionId: string,
    @Body() body: CreatePageDTO,
    @AuthUser() authUser: IAuthUser,
  ): Promise<Page> {
    return this.service.addPage(editionId, body, authUser);
  }

  @Post('hotspots')
  @ApiOperation({ summary: 'Bulk save/update hotspots for a page' })
  async saveHotspots(
    @Body() body: SaveHotspotsDTO,
    @AuthUser() authUser: IAuthUser,
  ): Promise<Hotspot[]> {
    return this.service.saveHotspots(body, authUser);
  }
}
