import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { Repository } from 'typeorm';
import { Ad } from '../entities/ad.entity';

@Injectable()
export class AdService extends BaseService<Ad> {
  constructor(
    @InjectRepository(Ad)
    private readonly _repo: Repository<Ad>,
  ) {
    super(_repo);
  }
}
