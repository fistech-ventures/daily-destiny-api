import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { Repository } from 'typeorm';
import { AdRequest } from '../entities/adRequest.entity';

@Injectable()
export class AdRequestService extends BaseService<AdRequest> {
  constructor(
    @InjectRepository(AdRequest)
    private readonly _repo: Repository<AdRequest>,
  ) {
    super(_repo);
  }
}
