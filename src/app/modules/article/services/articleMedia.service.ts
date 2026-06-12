import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { DataSource, Repository } from 'typeorm';
import { ArticleMedia } from '../entities/articleMedia.entity';

@Injectable()
export class ArticleMediaService extends BaseService<ArticleMedia> {
  constructor(
    @InjectRepository(ArticleMedia)
    private readonly _repo: Repository<ArticleMedia>,
    private readonly dataSource: DataSource,
  ) {
    super(_repo);
  }
}
