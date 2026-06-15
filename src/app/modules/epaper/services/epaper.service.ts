import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { Between, Repository } from 'typeorm';
import { EpaperCreateDTO, EpaperUpdateDTO } from '../dtos';
import { Epaper } from '../entities/epaper.entity';

@Injectable()
export class EpaperService extends BaseService<Epaper> {
  constructor(
    @InjectRepository(Epaper)
    private readonly _repo: Repository<Epaper>,
  ) {
    super(_repo);
  }

  async createOne(payload: EpaperCreateDTO, authUser: IAuthUser): Promise<Epaper> {
    const epaper = this._repo.create({
      ...payload,
      date: payload.date ? new Date(payload.date) : undefined,
      createdBy: authUser,
    });

    const saved = await this._repo.save(epaper);
    return this.findByIdBase((saved as any).id);
  }

  async updateOne(id: string, payload: EpaperUpdateDTO, authUser: IAuthUser): Promise<Epaper> {
    const epaper = await this.isExist({ id } as Epaper);

    const updateData: any = { ...payload };
    if (payload.date) {
      updateData.date = new Date(payload.date);
    }

    epaper.updatedBy = authUser;
    Object.assign(epaper, updateData);

    await this._repo.save(epaper);
    return this.findByIdBase(id);
  }

  async findAllBase(
    filters: any & {
      searchTerm?: string;
      limit?: number;
      page?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      sort?: any[];
      date?: string;
      dateFrom?: string;
      dateTo?: string;
      publicationName?: string;
    },
    options?: any,
  ): Promise<SuccessResponse<Epaper[]>> {
    const { date, dateFrom, dateTo, publicationName, limit, page, sortBy, sortOrder, sort, searchTerm, ...otherFilters } = filters;

    const where: any = { ...otherFilters };

    if (date) {
      where.date = new Date(date);
    }

    if (dateFrom && dateTo) {
      where.date = Between(new Date(dateFrom), new Date(dateTo));
    } else if (dateFrom) {
      where.date = Between(new Date(dateFrom), new Date());
    } else if (dateTo) {
      where.date = Between(new Date('1970-01-01'), new Date(dateTo));
    }

    if (publicationName) {
      where.publicationName = publicationName;
    }

    const opts: any = {
      where,
    };

    if (limit) opts.take = limit;
    if (page) opts.skip = (page - 1) * (limit || 20);
    if (options?.relations) opts.relations = options.relations;
    if (sortBy && sortOrder) {
      opts.order = { [sortBy]: sortOrder };
    }

    const [data, total] = await this._repo.findAndCount(opts);

    return new SuccessResponse<Epaper[]>('E-papers fetched successfully', data, {
      total,
      page: page || 1,
      limit: limit || 20,
      skip: opts.skip || 0,
    });
  }

  async findAllByDateRange(
    dateFrom: string,
    dateTo: string,
    publicationName?: string,
  ): Promise<SuccessResponse<Epaper[]>> {
    const where: any = {
      date: Between(new Date(dateFrom), new Date(dateTo)),
    };

    if (publicationName) {
      where.publicationName = publicationName;
    }

    const epapers = await this._repo.find({
      where,
      order: { date: 'DESC', pageNumber: 'ASC' },
    });

    return new SuccessResponse<Epaper[]>('E-papers fetched successfully', epapers);
  }

  async getPagesByDate(date: string, publicationName?: string): Promise<Epaper[]> {
    const where: any = {
      date: new Date(date),
    };

    if (publicationName) {
      where.publicationName = publicationName;
    }

    return this._repo.find({
      where,
      order: { pageNumber: 'ASC' },
    });
  }

  async getPublications(): Promise<string[]> {
    const result = await this._repo
      .createQueryBuilder('epaper')
      .select('DISTINCT epaper.publicationName', 'publicationName')
      .orderBy('epaper.publicationName', 'ASC')
      .getRawMany();

    return result.map((r) => r.publicationName);
  }

  async getAvailableDates(publicationName?: string): Promise<Date[]> {
    const queryBuilder = this._repo.createQueryBuilder('epaper').select('DISTINCT epaper.date', 'date');

    if (publicationName) {
      queryBuilder.where('epaper.publicationName = :publicationName', { publicationName });
    }

    const result = await queryBuilder.orderBy('epaper.date', 'DESC').getRawMany();
    return result.map((r) => r.date);
  }
}
