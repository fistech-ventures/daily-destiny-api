import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { IFindBaseOptions } from '@src/app/interfaces';
import { asyncForEach } from '@src/shared';
import { isNotEmptyObject } from 'class-validator';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Layout } from '../entities/layout.entity';
import { LayoutColumn } from '../entities/layoutColumns.entity';

@Injectable()
export class LayoutService extends BaseService<Layout> {
  constructor(
    @InjectRepository(Layout)
    private readonly _repo: Repository<Layout>,
    private readonly dataSource: DataSource,
  ) {
    super(_repo);
  }

  async createOne(payload: any, options: IFindBaseOptions<Layout>): Promise<Layout> {
    const { columns, ...restPayload } = payload;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let createdLayout: Layout;
    try {
      createdLayout = await queryRunner.manager.save(Layout, restPayload);

      if (columns && columns.length) {
        await asyncForEach(columns, async (item) => {
          await queryRunner.manager.save(LayoutColumn, {
            ...item,
            layoutId: createdLayout.id,
          } satisfies Partial<LayoutColumn>);
        });
      }
      await queryRunner.commitTransaction();
      return this.findByIdBase(createdLayout?.id, options);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOne(id: string, payload: any, options: IFindBaseOptions<Layout>): Promise<Layout> {
    const { columns, ...restPayload } = payload;

    const isExist = await this.repo.exists({ where: { id } });
    if (!isExist) {
      throw new NotFoundException('Subscription plan not found');
    }

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (isNotEmptyObject(restPayload)) {
        await queryRunner.manager.update(Layout, { id }, restPayload);
      }

      if (columns && columns.length) {
        const deletedItems = columns.filter((d) => d.id && d.isDeleted);
        if (deletedItems?.length)
          await queryRunner.manager.delete(
            LayoutColumn,
            deletedItems?.map((d) => d.id),
          );

        const newItems = columns.filter((d) => !d.id);
        await asyncForEach(newItems, async (d) => {
          delete d.isDeleted;
          await queryRunner.manager.save(LayoutColumn, {
            ...d,
            layoutId: id,
          } satisfies Partial<LayoutColumn>);
        });

        const updatedItems = columns.filter((d) => d.id && !d.isDeleted);
        await asyncForEach(updatedItems, async (d) => {
          delete d.isDeleted;
          await queryRunner.manager.update(LayoutColumn, d.id, d);
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
