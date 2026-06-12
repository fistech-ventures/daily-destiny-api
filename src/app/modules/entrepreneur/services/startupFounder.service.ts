import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { Repository } from 'typeorm';
import { StartupFounder } from '../entities/startupFounders.entity';

@Injectable()
export class StartupFounderService extends BaseService<StartupFounder> {
  constructor(
    @InjectRepository(StartupFounder)
    private readonly _repo: Repository<StartupFounder>,
  ) {
    super(_repo);
  }
}
