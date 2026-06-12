import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { Repository } from 'typeorm';
import { Entrepreneur } from '../entities/entrepreneur.entity';

@Injectable()
export class EntrepreneurService extends BaseService<Entrepreneur> {
  constructor(
    @InjectRepository(Entrepreneur)
    private readonly _repo: Repository<Entrepreneur>,
  ) {
    super(_repo);
  }
}
