import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { Repository } from 'typeorm';
import { SubCategory } from '../entities/subCategory.entity';

@Injectable()
export class SubCategoryService extends BaseService<SubCategory> {
  constructor(
    @InjectRepository(SubCategory)
    private readonly _repo: Repository<SubCategory>,
  ) {
    super(_repo);
  }
}
