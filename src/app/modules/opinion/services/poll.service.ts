import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { IFindBaseOptions } from '@src/app/interfaces';
import { asyncForEach } from '@src/shared';
import { isNotEmptyObject } from 'class-validator';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PollCreateDTO } from '../dtos/poll/create.dto';
import { PollUpdateDTO } from '../dtos/poll/update.dto';
import { Poll } from '../entities/poll.entity';
import { PollOption } from '../entities/pollOption.entity';

@Injectable()
export class PollService extends BaseService<Poll> {
  constructor(
    @InjectRepository(Poll)
    private readonly _repo: Repository<Poll>,
    private readonly dataSource: DataSource,
  ) {
    super(_repo);
  }

  async createOne(payload: PollCreateDTO, filters: IFindBaseOptions<Poll>): Promise<Poll> {
    const { options, ...restPayload } = payload;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let createdPoll: Poll;
    try {
      createdPoll = await queryRunner.manager.save(Poll, restPayload);
      if (options && options.length) {
        await asyncForEach(options, async (option) => {
          await queryRunner.manager.save(PollOption, {
            ...option,
            pollId: createdPoll.id,
          } satisfies Partial<PollOption>);
        });
      }
      await queryRunner.commitTransaction();
      return this.findByIdBase(createdPoll?.id, filters);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOne(
    id: string,
    payload: PollUpdateDTO,
    filters: IFindBaseOptions<Poll>,
  ): Promise<Poll> {
    const { options, ...restPayload } = payload;

    const isExist = await this.repo.exists({ where: { id } });
    if (!isExist) {
      throw new NotFoundException('Subscription plan not found');
    }

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (isNotEmptyObject(restPayload)) {
        await queryRunner.manager.update(Poll, { id }, restPayload);
      }

      if (options && options.length) {
        const deletedItems = options.filter((d) => d.id && d.isDeleted);
        if (deletedItems?.length)
          await queryRunner.manager.delete(
            PollOption,
            deletedItems?.map((d) => d.id),
          );

        const newItems = options.filter((d) => !d.id);
        await asyncForEach(newItems, async (d) => {
          delete d.isDeleted;
          await queryRunner.manager.save(PollOption, {
            ...d,
            pollId: id,
          } satisfies Partial<PollOption>);
        });

        const updatedItems = options.filter((d) => d.id && !d.isDeleted);
        await asyncForEach(updatedItems, async (d) => {
          delete d.isDeleted;
          await queryRunner.manager.update(PollOption, d.id, d);
        });
      }

      await queryRunner.commitTransaction();
      return this.findByIdBase(id, filters);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
