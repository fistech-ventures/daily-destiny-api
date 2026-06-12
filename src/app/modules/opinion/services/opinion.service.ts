import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { Repository } from 'typeorm';
import { Opinion } from '../entities/opinion.entity';

@Injectable()
export class OpinionService extends BaseService<Opinion> {
  constructor(
    @InjectRepository(Opinion)
    private readonly _repo: Repository<Opinion>,
  ) {
    super(_repo);
  }
}
