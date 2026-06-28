import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { IAuthUser } from '@src/app/interfaces';
import { Repository } from 'typeorm';
import { SpecialEvent } from '../entities/specialEvent.entity';
import { SpecialEventCreateDTO } from '../dtos/create.dto';
import { SpecialEventUpdateDTO } from '../dtos/update.dto';

@Injectable()
export class SpecialEventService extends BaseService<SpecialEvent> {
  constructor(
    @InjectRepository(SpecialEvent)
    private readonly _repo: Repository<SpecialEvent>,
  ) {
    super(_repo);
  }

  /**
   * Create a new special event with optional article associations
   */
  async createOne(data: SpecialEventCreateDTO, authUser: IAuthUser): Promise<SpecialEvent> {
    const { articleIds, ...eventData } = data;

    const event = this._repo.create({
      ...eventData,
      createdBy: authUser,
    });

    if (articleIds?.length) {
      event.articles = articleIds.map((id) => ({ id } as any));
    }

    const saved = await this._repo.save(event);
    return this.findByIdBase(saved.id, { relations: { articles: true } });
  }

  /**
   * Update a special event with optional article associations
   */
  async updateOne(id: string, data: SpecialEventUpdateDTO, authUser: IAuthUser): Promise<SpecialEvent> {
    const { articleIds, ...eventData } = data;

    await this.isExist({ id } as SpecialEvent);

    if (articleIds !== undefined) {
      // Reload articles relation
      const event = await this.findByIdBase(id, { relations: { articles: true } });

      if (articleIds.length > 0) {
        event.articles = articleIds.map((articleId) => ({ id: articleId } as any));
      } else {
        event.articles = [];
      }

      await this._repo.save(event);
    }

    // Update scalar fields
    if (Object.keys(eventData).length > 0) {
      await this._repo.update(id, { ...eventData, updatedBy: authUser } as any);
    }

    return this.findByIdBase(id, { relations: { articles: true } });
  }

  /**
   * Get a special event by slug
   */
  async findBySlug(slug: string): Promise<SpecialEvent> {
    return this.findOneBase({ slug, isActive: true } as SpecialEvent, {
      relations: { articles: true },
    });
  }
}
