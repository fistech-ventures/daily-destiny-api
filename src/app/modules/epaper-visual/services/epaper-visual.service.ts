import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { DataSource, Repository } from 'typeorm';
import { CreateEditionDTO } from '../dtos/createEdition.dto';
import { CreatePageDTO } from '../dtos/createPage.dto';
import { SaveHotspotsDTO } from '../dtos/saveHotspots.dto';
import { Edition, ENUM_EDITION_STATUS } from '../entities/edition.entity';
import { Hotspot } from '../entities/hotspot.entity';
import { Page } from '../entities/page.entity';

@Injectable()
export class EpaperVisualService extends BaseService<Edition> {
  constructor(
    @InjectRepository(Edition)
    private readonly _repo: Repository<Edition>,
    @InjectRepository(Page)
    private readonly _pageRepo: Repository<Page>,
    @InjectRepository(Hotspot)
    private readonly _hotspotRepo: Repository<Hotspot>,
    private readonly dataSource: DataSource,
  ) {
    super(_repo);
  }

  /**
   * Create a new daily edition
   */
  async createEdition(payload: CreateEditionDTO, authUser: IAuthUser): Promise<Edition> {
    const publishDate = new Date(payload.publishDate);
    publishDate.setHours(0, 0, 0, 0);

    // Check if an edition already exists for this date
    const existing = await this._repo.findOne({ where: { publishDate } });
    if (existing) {
      throw new BadRequestException(`An edition for ${payload.publishDate} already exists`);
    }

    const edition = this._repo.create({
      publishDate,
      status: payload.status || ENUM_EDITION_STATUS.DRAFT,
      createdBy: authUser,
    });

    const saved = await this._repo.save(edition);
    return this.findByIdBase(saved.id, { relations: { pages: { hotspots: true } } });
  }

  /**
   * Add a page to an edition
   */
  async addPage(editionId: string, payload: CreatePageDTO, authUser: IAuthUser): Promise<Page> {
    const edition = await this._repo.findOne({ where: { id: editionId } });
    if (!edition) {
      throw new NotFoundException(`Edition with ID ${editionId} not found`);
    }

    // Check for duplicate page number within the same edition
    const existingPage = await this._pageRepo.findOne({
      where: { editionId, pageNumber: payload.pageNumber },
    });
    if (existingPage) {
      throw new BadRequestException(
        `Page number ${payload.pageNumber} already exists in edition ${editionId}`,
      );
    }

    const page = this._pageRepo.create({
      editionId,
      pageNumber: payload.pageNumber,
      imageUrl: payload.imageUrl,
      createdBy: authUser,
    });

    return this._pageRepo.save(page);
  }

  /**
   * Bulk save/update hotspots for a page.
   * Uses a transaction: deletes existing hotspots for the page, then inserts the new ones.
   */
  async saveHotspots(payload: SaveHotspotsDTO, authUser: IAuthUser): Promise<Hotspot[]> {
    const { pageId, hotspots } = payload;

    // Verify the page exists
    const page = await this._pageRepo.findOne({ where: { id: pageId } });
    if (!page) {
      throw new NotFoundException(`Page with ID ${pageId} not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Delete existing hotspots for this page
      await queryRunner.manager.delete(Hotspot, { pageId });

      // Insert new hotspots
      const createdHotspots = hotspots.map((h) =>
        queryRunner.manager.create(Hotspot, {
          pageId,
          title: h.title || null,
          coordinates: h.coordinates,
          createdBy: authUser,
        }),
      );

      const saved = await queryRunner.manager.save(createdHotspots);

      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get the latest published edition with all pages and hotspots
   */
  async findLatestPublished(): Promise<Edition> {
    const edition = await this._repo.findOne({
      where: { status: ENUM_EDITION_STATUS.PUBLISHED, isActive: true },
      relations: { pages: { hotspots: true } },
      order: { publishDate: 'DESC' },
    });

    if (!edition) {
      throw new NotFoundException('No published edition found');
    }

    return edition;
  }

  /**
   * Find an edition by its publish date
   */
  async findByDate(date: string): Promise<Edition> {
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    const edition = await this._repo.findOne({
      where: { publishDate: searchDate, isActive: true },
      relations: { pages: { hotspots: true } },
    });

    if (!edition) {
      throw new NotFoundException(`No edition found for date ${date}`);
    }

    return edition;
  }

  /**
   * Find edition by ID with relations
   */
  async findByIdWithRelations(id: string): Promise<Edition> {
    const edition = await this._repo.findOne({
      where: { id },
      relations: { pages: { hotspots: true } },
    });

    if (!edition) {
      throw new NotFoundException(`Edition with ID ${id} not found`);
    }

    return edition;
  }

  /**
   * Override delete to cascade cleanly
   */
  async deleteOne(id: string): Promise<SuccessResponse> {
    const edition = await this._repo.findOne({
      where: { id },
      relations: { pages: true },
    });

    if (!edition) {
      throw new NotFoundException(`Edition with ID ${id} not found`);
    }

    // Cascade delete: pages and hotspots are handled by DB CASCADE
    await this._repo.remove(edition);

    return new SuccessResponse('Edition deleted successfully', null);
  }
}
