import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@src/app/decorators';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { SpecialEventCreateDTO, SpecialEventFilterDTO, SpecialEventUpdateDTO } from '../../dtos';
import { SpecialEvent } from '../../entities/specialEvent.entity';
import { SpecialEventService } from '../../services/specialEvent.service';

@ApiTags('Special Event')
@ApiBearerAuth()
@Controller('internal/special-events')
export class SpecialEventInternalController {
  constructor(private readonly service: SpecialEventService) {}

  RELATIONS = { articles: true };

  @Get()
  @ApiOperation({ summary: 'Get all special events' })
  async findAll(@Query() query: SpecialEventFilterDTO): Promise<SuccessResponse<SpecialEvent[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a special event by ID' })
  async findById(@Param('id') id: string): Promise<SpecialEvent> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new special event' })
  async createOne(
    @Body() body: SpecialEventCreateDTO,
    @AuthUser() authUser: IAuthUser,
  ): Promise<SpecialEvent> {
    return this.service.createOne(body, authUser);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a special event' })
  async updateOne(
    @Param('id') id: string,
    @Body() body: SpecialEventUpdateDTO,
    @AuthUser() authUser: IAuthUser,
  ): Promise<SpecialEvent> {
    return this.service.updateOne(id, body, authUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a special event' })
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }
}
