import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@src/app/decorators';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import {
  LocationCreateDTO,
  LocationFilterDTO,
  LocationSeedDTO,
  LocationUpdateDTO,
} from '../dtos';
import { Location } from '../entities/location.entity';
import { LocationService } from '../services/location.service';

@ApiTags('Location')
@ApiBearerAuth()
@Controller('internal/locations')
export class LocationInternalController {
  constructor(private readonly service: LocationService) { }

  @Get()
  @ApiOperation({ summary: 'Get all locations with filters' })
  async findAll(@Query() query: LocationFilterDTO): Promise<SuccessResponse<Location[]>> {
    query['isActive'] = true;
    query['sortBy'] = 'createdAt';
    return this.service.findAllBase({ ...query, isActive: true }, { relations: { parent: true } });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get location with children' })
  async findById(@Param('id') id: string): Promise<Location> {
    return this.service.getLocationWithChildren(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  async createOne(
    @Body() body: LocationCreateDTO,
    @AuthUser() authUser: IAuthUser,
  ): Promise<Location> {
    return this.service.createOne(body, authUser);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a location' })
  async updateOne(
    @Param('id') id: string,
    @Body() body: LocationUpdateDTO,
    @AuthUser() authUser: IAuthUser,
  ): Promise<Location> {
    return this.service.updateOne(id, body, authUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a location' })
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.softDeleteLocation(id);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Bulk seed locations (idempotent, for initialization)' })
  async seedLocations(
    @Body() body: LocationSeedDTO,
    @AuthUser() authUser: IAuthUser,
  ): Promise<SuccessResponse> {
    return this.service.seedLocations(body, authUser);
  }
}
