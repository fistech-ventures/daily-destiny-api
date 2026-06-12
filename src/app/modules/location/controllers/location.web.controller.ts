import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { Location } from '../entities/location.entity';
import { LocationService } from '../services/location.service';
import { ENUM_LOCATION_TYPE } from '@src/shared/enums/common.enums';

@ApiTags('Location - Public')
@Controller('web/locations')
export class LocationWebController {
  constructor(private readonly service: LocationService) {}

  @Public()
  @Get('children/:parentId')
  @ApiOperation({ summary: 'Get direct children of a location (for cascading dropdowns)' })
  async getChildren(@Param('parentId') parentId: string): Promise<Location[]> {
    return this.service.getChildren(parentId);
  }

  @Public()
  @Get('tree')
  @ApiOperation({ summary: 'Get full nested tree starting from divisions (cached, public API)' })
  async getFullTree(): Promise<Location[]> {
    return this.service.getFullTree(ENUM_LOCATION_TYPE.DIVISION);
  }
}
