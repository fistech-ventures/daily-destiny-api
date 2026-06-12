import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { IFindBaseOptions } from '@src/app/interfaces';
import { asyncForEach } from '@src/shared';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PageCreateDTO } from '../dtos/page/create.dto';
import { Page } from '../entities/page.entity';
import { PageSection } from '../entities/pageSection.entity';
import { PageUpdateDTO } from '../dtos/page/update.dto';
import { isNotEmptyObject } from 'class-validator';

@Injectable()
export class PageService extends BaseService<Page> {
  constructor(
    @InjectRepository(Page)
    private readonly _repo: Repository<Page>,
    private readonly dataSource: DataSource,
  ) {
    super(_repo);
  }

  async createOne(payload: PageCreateDTO, options: IFindBaseOptions<Page>): Promise<Page> {
    const { sections, ...restPayload } = payload;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let createdPage: any;
    try {
      createdPage = await queryRunner.manager.upsert(Page, restPayload, ['slug']);

      if (sections && sections.length) {
        await asyncForEach(sections, async (item) => {
          await queryRunner.manager.save(PageSection, {
            ...item,
            pageId: createdPage.id,
          } satisfies Partial<PageSection>);
        });
      }
      await queryRunner.commitTransaction();
      return this.findByIdBase(createdPage?.id, options);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOne(
    id: string,
    payload: PageUpdateDTO,
    options: IFindBaseOptions<Page>,
  ): Promise<Page> {
    const { sections, ...restPayload } = payload;

    const isExist = await this.repo.exists({ where: { id } });
    if (!isExist) {
      throw new NotFoundException('Subscription plan not found');
    }

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (isNotEmptyObject(restPayload)) {
        await queryRunner.manager.update(Page, { id }, restPayload);
      }

      if (sections && sections.length) {
        const deletedItem = sections.filter((d) => d.id && d.isDeleted);
        await asyncForEach(deletedItem, async (d) => {
          await queryRunner.manager.delete(PageSection, d.id);
        });

        const newItems = sections.filter((d) => !d.id);
        await asyncForEach(newItems, async (d) => {
          delete d.isDeleted;
          await queryRunner.manager.save(PageSection, {
            ...d,
            pageId: id,
          } satisfies Partial<PageSection>);
        });

        const updatedItems = sections.filter((d) => d.id && !d.isDeleted);
        await asyncForEach(updatedItems, async (d) => {
          delete d.isDeleted;
          await queryRunner.manager.update(PageSection, d.id, d);
        });
      }

      await queryRunner.commitTransaction();
      return this.findByIdBase(id, options);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
