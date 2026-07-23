import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { IFindBaseOptions } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { Raw, Repository } from 'typeorm';
import { AdFilterDTO } from '../dtos/ad/filter.dto';
import { Ad } from '../entities/ad.entity';

@Injectable()
export class AdService extends BaseService<Ad> {
  constructor(
    @InjectRepository(Ad)
    private readonly _repo: Repository<Ad>,
  ) {
    super(_repo);
  }

  async findAllBase(
    filters: AdFilterDTO,
    options?: IFindBaseOptions<Ad>,
  ): Promise<SuccessResponse<Ad[]>> {
    const { categoryId, ...restFilters } = filters;

    // If categoryId is provided, add a raw SQL filter on the JSONB categories array
    if (categoryId) {
      restFilters['categories'] = Raw(
        (alias) => `${alias} ? '${categoryId}'`,
      ) as any;
    }

    return super.findAllBase(restFilters as any, options);
  }
}
