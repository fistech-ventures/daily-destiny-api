import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { IFindBaseOptions } from '@src/app/interfaces';
import { asyncForEach } from '@src/shared';
import { isNotEmptyObject } from 'class-validator';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { StartupCreateDTO, StartupUpdateDTO } from '../dtos';
import { Startup } from '../entities/startup.entity';
import { StartupFounder } from '../entities/startupFounders.entity';

@Injectable()
export class StartupService extends BaseService<Startup> {
  constructor(
    @InjectRepository(Startup)
    private readonly _repo: Repository<Startup>,
    private readonly dataSource: DataSource,
  ) {
    super(_repo);
  }

  async createOne(payload: StartupCreateDTO, options: IFindBaseOptions<Startup>): Promise<Startup> {
    const { founders, ...restPayload } = payload;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let createdStartup: Startup;
    try {
      createdStartup = await queryRunner.manager.save(Startup, restPayload);

      if (founders && founders.length) {
        await asyncForEach(founders, async (item) => {
          await queryRunner.manager.save(StartupFounder, {
            ...item,
            companyId: createdStartup.id,
          } satisfies Partial<StartupFounder>);
        });
      }

      await queryRunner.commitTransaction();
      return this.findByIdBase(createdStartup?.id, options);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOne(
    id: string,
    payload: StartupUpdateDTO,
    options: IFindBaseOptions<Startup>,
  ): Promise<Startup> {
    const { founders, ...restPayload } = payload;

    const isExist = await this.repo.exists({ where: { id } });
    if (!isExist) {
      throw new NotFoundException('Subscription plan not found');
    }

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (isNotEmptyObject(restPayload)) {
        await queryRunner.manager.update(Startup, { id }, restPayload);
      }

      if (founders && founders.length) {
        const deletedItem = founders.filter((d) => d.id && d.isDeleted);
        await asyncForEach(deletedItem, async (d) => {
          await queryRunner.manager.delete(StartupFounder, d.id);
        });

        const newItems = founders.filter((d) => !d.id);
        await asyncForEach(newItems, async (d) => {
          delete d.isDeleted;
          await queryRunner.manager.save(StartupFounder, {
            ...d,
            companyId: id,
          } satisfies Partial<StartupFounder>);
        });

        const updatedItems = founders.filter((d) => d.id && !d.isDeleted);
        await asyncForEach(updatedItems, async (d) => {
          delete d.isDeleted;
          await queryRunner.manager.update(StartupFounder, d.id, d);
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
