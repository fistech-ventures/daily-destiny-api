import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { Repository } from 'typeorm';
import { LayoutColumn } from '../entities/layoutColumns.entity';

@Injectable()
export class LayoutColumnService extends BaseService<LayoutColumn> {
  constructor(
    @InjectRepository(LayoutColumn)
    private readonly _repo: Repository<LayoutColumn>,
  ) {
    super(_repo);
  }
}
