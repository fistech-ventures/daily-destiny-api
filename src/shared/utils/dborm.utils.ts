import { BaseEntity, IMultipleSort } from '@src/app/base';
import { IFindBaseOptions } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import {
  DataSource,
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  QueryRunner,
  Raw,
  Repository,
} from 'typeorm';
import { toNumber } from './convert.utils';

export const startTransaction = async (dataSource: DataSource): Promise<QueryRunner> => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  return queryRunner;
};

export const commitTransaction = async (
  queryRunner: QueryRunner,
  _timeout?: number,
): Promise<void> => {
  const timeout = _timeout ? _timeout : 1000 * 60;

  const timeoutPromise = new Promise<void>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Transaction timeout'));
    }, timeout);
  });
  try {
    await Promise.race([
      (async () => {
        await queryRunner.commitTransaction();
      })(),
      timeoutPromise,
    ]);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const rollbackTransaction = async (queryRunner: QueryRunner): Promise<void> => {
  try {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
};

export const lockEntireTable = async (
  queryRunner: QueryRunner,
  tableName: string,
  lockMode:
    | 'ACCESS SHARE'
    | 'ROW SHARE'
    | 'ROW EXCLUSIVE'
    | 'SHARE UPDATE EXCLUSIVE'
    | 'SHARE'
    | 'SHARE ROW EXCLUSIVE'
    | 'EXCLUSIVE'
    | 'ACCESS SHARE'
    | 'ACCESS EXCLUSIVE',
): Promise<QueryRunner> => {
  await queryRunner.query(`LOCK TABLE "${tableName}" IN ${lockMode} MODE`);
  return queryRunner;
};

export async function findAllByRepo<T extends BaseEntity>(
  repo: Repository<T>,
  filters: T & {
    searchTerm?: string;
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    sort?: IMultipleSort[];
  },
  options?: IFindBaseOptions<T>,
): Promise<SuccessResponse<T[]>> {
  const {
    sortBy = 'createdAt',
    sortOrder = 'DESC',
    sort,
    searchTerm,
    limit: take = 20,
    page = 1,
    ...queryOptions
  } = filters;
  const skip = (page - 1) * take;

  const relations = repo.metadata.relations.map((r) => r.propertyName);
  //! TODO CHECK USE CASE
  // Object.keys(queryOptions).forEach((key) => {
  //   if (relations.includes(key) && isUuidValidator(queryOptions[key])) {
  //     queryOptions[key] = {
  //       id: queryOptions[key],
  //     };
  //   }
  // });

  const opts: FindManyOptions = {
    where: queryOptions as FindOptionsWhere<T>,
  };

  if (searchTerm && repo.target.valueOf().hasOwnProperty('SEARCH_TERMS')) {
    let SEARCH_TERMS = options.SEARCH_TERMS || (repo.target.valueOf() as any).SEARCH_TERMS || [];

    if (Object.keys(queryOptions).length) {
      SEARCH_TERMS = SEARCH_TERMS.filter(
        (term: string) => !Object.keys(queryOptions).includes(term),
      );
    }

    const where = [];
    for (const term of SEARCH_TERMS) {
      // Check if the search term is a relation
      if (term?.includes('.')) {
        const [relation, field] = term.split('.');
        // Check if the relation is allowed
        if (!relations.includes(relation)) {
          continue;
        }
        where.push({
          ...queryOptions,
          [relation]: {
            [field]: ILike(`%${searchTerm}%`),
          },
        });
      } else if (term?.includes(':')) {
        const [field, property] = term.split(':');
        // search on jsonb property
        where.push({
          ...queryOptions,
          [field]: Raw((alias) => `${alias} ->> '${property}' ILIKE '%${searchTerm}%'`),
        });
      } else {
        where.push({
          ...queryOptions,
          [term]: ILike(`%${searchTerm}%`),
        });
      }
    }
    opts.where = where as FindManyOptions<T>['where'];
  }

  if (skip && !isNaN(skip)) opts.skip = skip;
  if (take && !isNaN(take)) opts.take = take;

  if (options?.relations) opts.relations = options?.relations;

  // createdAt are always selected for default createdAt desc order
  if (options?.select) opts.select = { ...options?.select, createdAt: true };

  if (sortBy && sortOrder) {
    opts.order = {
      [sortBy]: sortOrder,
    };
  }

  if (sort) {
    const sortOrderBy = sort?.reduce((result, { by, order }) => {
      result[by] = order;
      return result;
    }, {});

    opts.order = sortOrderBy;
  }

  const [data, total] = await repo.findAndCount(opts);

  return new SuccessResponse<T[]>(`${repo.metadata.name} fetched successfully`, data, {
    total: total,
    page: toNumber(page),
    limit: toNumber(take),
    skip,
  });
}
