import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindOptionsRelations } from 'typeorm';
import { TagFilterDTO } from '../../dtos/tag/filter.dto';
import { Tag } from '../../entities/tag.entity';
import { TagService } from '../../services/tag.service';
import { Public } from '@src/app/decorators/publicRoute.decorator';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('web/tags')
export class TagWebController {
  constructor(private readonly service: TagService) { }
  RELATIONS: FindOptionsRelations<Tag> = {};

  //   @Public()
  //   @Get()
  //   async findAll(@Query() query: TagFilterDTO): Promise<SuccessResponse<Tag[]>> {
  //   const { page, limit, skip } = getPaginationData({ page: query?.page || 1, limit: query?.limit || 10 })
  //     query['sortBy'] = 'article';
  //     query['sortOrder'] = 'desc';
  //     query['isActive'] = true;
  //     const [tags,total] = await this.service.repo.findAndCount({ 
  //       where:{
  //       isActive:true
  //     },
  //     select:{
  //       title:true,
  // // article:true,
  //     },
  //     order:{article:'desc'},
  //     skip: skip
  //   });
  //     return new SuccessResponse('',tags,{total,page,limit})
  //   }


  @Public()
  @Get()
  async findAll(@Query() query: TagFilterDTO): Promise<string[]> {
    query['isActive'] = true;
    const tags = await this.service.repo.find({
      where: {
        isActive: true
      },
      select: {
        title: true,
      },
      order: { article: 'desc' },
      take: 10
    });
    return tags.map(tag => tag.title);
  }
}