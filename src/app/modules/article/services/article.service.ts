import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { asyncForEach, generateCode } from '@src/shared';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ENUM_ARTICLE_STATUS } from '../const';
import { ArticleCreateDTO } from '../dtos/article/create.dto';
import { ArticleMediaUpdateDTO, ArticleUpdateDTO } from '../dtos/article/update.dto';
import { Article } from '../entities/article.entity';
import { ArticleMedia } from '../entities/articleMedia.entity';
import { ArticleMediaService } from './articleMedia.service';

@Injectable()
export class ArticleService extends BaseService<Article> {
  constructor(
    @InjectRepository(Article)
    private readonly _repo: Repository<Article>,
    private readonly dataSource: DataSource,
    private readonly articleMediaService: ArticleMediaService,
  ) {
    super(_repo);
  }
  async createOne(
    payload: ArticleCreateDTO,
    authUser: IAuthUser,
  ): Promise<Article> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { medias = [], locations = [], metaTitle, metaDescription, metaImage, metaKeywords = [], divisionId, districtId, upazillaId, ...data } = payload
      data['code'] = await this.generateUniqueArticleCode(queryRunner);
      data['createdBy'] = authUser;
      data['seoMetaData'] = { title: metaTitle, description: metaDescription, image: metaImage, keywords: metaKeywords };

      // Handle hierarchical location IDs
      const finalLocations = [...locations];
      if (divisionId) {
        finalLocations.push({ locationId: divisionId, isPrimary: false });
      }
      if (districtId) {
        finalLocations.push({ locationId: districtId, isPrimary: false });
      }
      if (upazillaId) {
        finalLocations.push({ locationId: upazillaId, isPrimary: false });
      }

      // Store tags as simple array of strings
      data['tags'] = data.tags || [];

      // 4. save article
      if (data?.status && data?.status === ENUM_ARTICLE_STATUS.PUBLISHED) {
        data['publishedBy'] = authUser;
        data['publishedAt'] = new Date().toString()
      } else delete data?.status
      const created = this._repo.create(data);
      const saved = await queryRunner.manager.save(created);

      if (medias && medias.length > 0) {
        await asyncForEach(medias, async (media) => {
          await queryRunner.manager.save(
            Object.assign(new ArticleMedia(), {
              ...media,
              articleId: created.id,
            }),
          );
        });
      }

      // Handle article locations
      if (finalLocations && finalLocations.length > 0) {
        await this.handleArticleLocations(queryRunner, saved.id, finalLocations);
      }

      await queryRunner.commitTransaction();

      return saved;

    } catch (error) {
      console.error("🚀 ~ ArticleService ~ createOne ~ error:", error)
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async generateUniqueArticleCode(queryRunner: QueryRunner): Promise<string> {
    let counter = 0;
    let isExist = true;
    let code: string;

    while (isExist) {
      code = `${generateCode()}${counter}`;
      const article = await queryRunner.manager.exists(Article, { where: { code } });
      isExist = article;
      if (isExist) {
        counter++;
      }
    }
    return code;
  }

  async findRelatedArticleAndTopicById(id: string): Promise<SuccessResponse> {
    const article = await this.repo.findOne({
      where: {
        id,
        isActive: true,
        status: ENUM_ARTICLE_STATUS.PUBLISHED,
      },
      relations: { category: true },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    const categoryId = article.category?.id || null;
    const tags: string[] = article.tags || [];

    const qb = this.repo
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .where('article.id != :id', { id })
      .andWhere('article.status = :status', { status: ENUM_ARTICLE_STATUS.PUBLISHED })
      .andWhere('article.type = :type', { type: article.type });

    // 🧠 Build conditions safely
    if (categoryId && tags.length > 0) {
      qb.andWhere(
        `(article.categoryId = :categoryId OR article.tags ?| array[:...tags])`,
        { categoryId, tags },
      );
    } else if (categoryId) {
      qb.andWhere(`article.categoryId = :categoryId`, { categoryId });
    } else if (tags.length > 0) {
      qb.andWhere(`article.tags ?| array[:...tags]`, { tags });
    } else {
      // ❗ fallback: no category, no tags → just latest articles
      qb.orderBy('article."createdAt"', 'DESC');
    }

    const relatedArticles = await qb
      .orderBy('article."date"', 'DESC')
      .limit(10)
      .getMany();

    // 🧠 Collect topics safely
    const topicSet = new Set<string>();

    relatedArticles.forEach(a => {
      if (Array.isArray(a.tags)) {
        a.tags.forEach(tag => tag && topicSet.add(tag));
      }
    });

    const topics = Array.from(topicSet).slice(0, 10);

    return new SuccessResponse('', {
      topics,
      articles: relatedArticles,
    });
  };

  async updateOne(
    id: string,
    payload: ArticleUpdateDTO,
    authUser: IAuthUser
  ): Promise<any> {
    const articleData = await this.isExist({ id });
    const { metaTitle, metaDescription, metaImage, metaKeywords = [], locations = [], divisionId, districtId, upazillaId, ...restPayload } = payload
    const updateData = { ...restPayload };
    updateData['updatedBy'] = authUser;
    updateData['seoMetaData'] = { title: metaTitle, description: metaDescription, image: metaImage, keywords: metaKeywords };

    // Handle hierarchical location IDs
    const finalLocations = [...locations];
    if (divisionId) {
      finalLocations.push({ locationId: divisionId, isPrimary: false });
    }
    if (districtId) {
      finalLocations.push({ locationId: districtId, isPrimary: false });
    }
    if (upazillaId) {
      finalLocations.push({ locationId: upazillaId, isPrimary: false });
    }

    if (updateData?.status && !Object.values(ENUM_ARTICLE_STATUS).includes(updateData?.status)) {
      throw new BadRequestException(`Invalid status!`);
    }

    if (updateData?.status && updateData?.status === articleData.status) {
      throw new BadRequestException(`Status already ${updateData.status}!`);
    }

    if (updateData?.status && updateData?.status === ENUM_ARTICLE_STATUS.PUBLISHED) {
      updateData['publishedBy'] = authUser;
      updateData['publishedAt'] = new Date();
    }

    if (updateData?.status && updateData?.status === ENUM_ARTICLE_STATUS.ARCHIVED) {
      updateData['archivedBy'] = authUser;
      updateData['archivedAt'] = new Date();
    }

    const { medias = [], tags = [] } = payload;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update tags as simple array of strings
      if (tags?.length) {
        updateData['tags'] = tags;
      }

      // Handle article locations
      if (finalLocations && finalLocations.length > 0) {
        await this.handleArticleLocations(queryRunner, id, finalLocations);
      }

      const articleToUpdate = await queryRunner.manager.findOne(Article, { where: { id } });
      Object.assign(articleToUpdate, updateData);
      await queryRunner.manager.save(articleToUpdate);

      if (medias && medias.length > 0) {
        const deletedItems = medias.filter((media) => media.isDeleted);
        const newOrUpdatedItems = medias.filter((media) => !media.isDeleted);

        await asyncForEach(deletedItems, async (media: ArticleMediaUpdateDTO) => {
          await queryRunner.manager.delete(ArticleMedia, {
            articleId: id,
            id: media.id,
          });
        });

        await asyncForEach(newOrUpdatedItems, async (media: ArticleMediaUpdateDTO) => {
          const productMediaExist = await this.articleMediaService.findOne({
            where: {
              articleId: id,
            },
          });

          if (productMediaExist) {
            await queryRunner.manager.save(
              Object.assign(new ArticleMedia(), {
                ...media,
                id: productMediaExist.id,
                articleId: id,
              }),
            );
          } else {
            await queryRunner.manager.save(
              Object.assign(new ArticleMedia(), {
                ...media,
                articleId: id,
              }),
            );
          }
        });
      }
      await queryRunner.commitTransaction();
      return this.findByIdBase(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Handle article location assignments
   */
  async handleArticleLocations(
    queryRunner: QueryRunner,
    articleId: string,
    locations: Array<{ locationId: string; isPrimary?: boolean }> | undefined,
  ): Promise<void> {
    if (!locations || locations.length === 0) return;

    // Delete existing locations for this article
    await queryRunner.manager.delete('article_locations', { articleId });

    // Insert new locations
    for (const location of locations) {
      await queryRunner.manager.insert('article_locations', {
        articleId,
        locationId: location.locationId,
        isPrimary: location.isPrimary || false,
      });
    }
  }

  /**
   * Get location and all descendant IDs using recursive CTE
   */
  async getLocationDescendants(locationId: string): Promise<string[]> {
    const result = await this._repo.query(`
      WITH RECURSIVE location_tree AS (
        SELECT id FROM locations WHERE id = $1
        UNION ALL
        SELECT l.id FROM locations l
        INNER JOIN location_tree lt ON l."parentId" = lt.id
      )
      SELECT id FROM location_tree
    `, [locationId]);

    return result.map((row: any) => row.id);
  }

  /**
   * Find popular articles sorted by engagement score, filtered by isActive/status
   */
  async findPopularArticles(
    query: any,
  ): Promise<{ data: Article[]; total: number; page: number; limit: number; skip: number }> {
    const page = parseInt(String(query.page), 10) || 1;
    const limit = parseInt(String(query.limit), 10) || 10;
    const skip = (page - 1) * limit;

    // Build WHERE conditions for raw SQL
    const conditions: string[] = ['a."isActive" = $1'];
    const params: any[] = [query.isActive ?? true];
    let paramIndex = 2;

    if (query.status) {
      conditions.push(`a.status = $${paramIndex++}`);
      params.push(query.status);
    }
    if (query.categoryId) {
      conditions.push(`a."categoryId" = $${paramIndex++}`);
      params.push(query.categoryId);
    }
    if (query.subCategoryId) {
      conditions.push(`a."subCategoryId" = $${paramIndex++}`);
      params.push(query.subCategoryId);
    }
    if (query.authorId) {
      conditions.push(`a."authorId" = $${paramIndex++}`);
      params.push(query.authorId);
    }
    if (query.type) {
      conditions.push(`a.type = $${paramIndex++}`);
      params.push(query.type);
    }
    if (query.language) {
      conditions.push(`a.language = $${paramIndex++}`);
      params.push(query.language);
    }
    if (query.isExclusive !== undefined) {
      conditions.push(`a."isExclusive" = $${paramIndex++}`);
      params.push(query.isExclusive);
    }
    if (query.isFeatured !== undefined) {
      conditions.push(`a."isFeatured" = $${paramIndex++}`);
      params.push(query.isFeatured);
    }
    if (query.topics?.length) {
      conditions.push(`a.tags @> $${paramIndex++}`);
      params.push(JSON.stringify(query.topics));
    }

    const whereClause = conditions.join(' AND ');

    // Get total count using raw SQL
    const countResult = await this.dataSource.query(
      `SELECT COUNT(*) as total FROM articles a
       INNER JOIN article_popularity ap ON ap."articleId" = a.id
       WHERE ${whereClause}`,
      params,
    );
    const total = parseInt(countResult[0]?.total, 10) || 0;

    if (total === 0) {
      return { data: [], total: 0, page, limit, skip };
    }

    // Get paginated article IDs ordered by popularity score
    const idRows = await this.dataSource.query(
      `SELECT a.id FROM articles a
       INNER JOIN article_popularity ap ON ap."articleId" = a.id
       WHERE ${whereClause}
       ORDER BY ap.score DESC, a."createdAt" DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...params, limit, skip],
    );

    const ids = idRows.map((r: any) => r.id);

    // Load full articles with relations using query builder
    const articles = await this._repo.createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.subCategory', 'subCategory')
      .leftJoinAndSelect('article.medias', 'medias')
      .leftJoinAndSelect('article.locations', 'locations')
      .leftJoinAndSelect('locations.location', 'location')
      .where('article.id IN (:...ids)', { ids })
      .getMany();

    // Reorder articles to match the popularity order from raw SQL
    const articleMap = new Map(articles.map((a) => [a.id, a]));
    const data = ids
      .map((id: string) => articleMap.get(id))
      .filter((a): a is Article => !!a);

    return { data, total, page, limit, skip };
  }

  /**
   * Find articles with location filter
   */
  async findWithLocationFilter(
    query: any,
  ): Promise<{ data: Article[]; total: number; page: number; limit: number; skip: number }> {
    // Build SQL to get all descendant locations
    let locationIds: string[] = [];

    if (query.locationId) {
      locationIds = [query.locationId];
    } else if (query.divisionId) {
      locationIds = await this.getLocationDescendants(query.divisionId);
    } else if (query.districtId) {
      locationIds = await this.getLocationDescendants(query.districtId);
    } else if (query.upazillaId) {
      locationIds = await this.getLocationDescendants(query.upazillaId);
    } else if (query.unionId) {
      locationIds = [query.unionId];
    }

    // Build query with location filter
    const queryBuilder = this._repo.createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.subCategory', 'subCategory')
      .leftJoinAndSelect('article.medias', 'medias')
      .leftJoinAndSelect('article.locations', 'locations')
      .leftJoinAndSelect('locations.location', 'location')
      .where('article.isActive = true')
      .andWhere('article.id IN (SELECT DISTINCT al."articleId" FROM article_locations al WHERE al."locationId" IN (:...locationIds))',
        { locationIds });

    // Apply status filter if provided (for internal controller)
    if (query.status) {
      queryBuilder.andWhere('article.status = :status', { status: query.status });
    }

    // Apply other filters
    if (query.categoryId) {
      queryBuilder.andWhere('article.categoryId = :categoryId', { categoryId: query.categoryId });
    }
    if (query.subCategoryId) {
      queryBuilder.andWhere('article.subCategoryId = :subCategoryId', { subCategoryId: query.subCategoryId });
    }
    if (query.authorId) {
      queryBuilder.andWhere('article.authorId = :authorId', { authorId: query.authorId });
    }
    if (query.type) {
      queryBuilder.andWhere('article.type = :type', { type: query.type });
    }
    if (query.language) {
      queryBuilder.andWhere('article.language = :language', { language: query.language });
    }
    if (query.isExclusive !== undefined) {
      queryBuilder.andWhere('article.isExclusive = :isExclusive', { isExclusive: query.isExclusive });
    }
    if (query.isFeatured !== undefined) {
      queryBuilder.andWhere('article.isFeatured = :isFeatured', { isFeatured: query.isFeatured });
    }
    if (query.topics?.length) {
      queryBuilder.andWhere(`article.tags @> :tags`, { tags: JSON.stringify(query.topics) });
    }

    // Pagination
    const page = parseInt(String(query.page), 10) || 1;
    const limit = parseInt(String(query.limit), 10) || 10;
    const skip = (page - 1) * limit;

    queryBuilder.orderBy('article.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit, skip };
  }
}
