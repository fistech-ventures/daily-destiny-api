import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { Repository } from 'typeorm';
import { TagsUpsertBulkDTO } from '../dtos/tag/create.dto';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagService extends BaseService<Tag> {
  constructor(
    @InjectRepository(Tag)
    private readonly _repo: Repository<Tag>,
  ) {
    super(_repo);
  }

  async upsertBulkTags(data: TagsUpsertBulkDTO): Promise<any> {
    const { tags = [] } = data;

    if (!tags.length) {
      throw new BadRequestException("No data to sync!");
    }

    // ✅ remove duplicates + trim
    const uniqueTags = Array.from(
      new Set(tags.map((t: string) => t.trim()).filter(Boolean))
    );

    const payload = uniqueTags.map((title) => ({
      title,
      isActive: true,
    }));

    await this._repo.upsert(payload, ['title']);

    return this.findAllBase({});
  }
}
