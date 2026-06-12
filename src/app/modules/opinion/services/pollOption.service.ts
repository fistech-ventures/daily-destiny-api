import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { Repository } from 'typeorm';
import { PollOption } from '../entities/pollOption.entity';

@Injectable()
export class PollOptionService extends BaseService<PollOption> {
  constructor(
    @InjectRepository(PollOption)
    private readonly _repo: Repository<PollOption>,
  ) {
    super(_repo);
  }
}
