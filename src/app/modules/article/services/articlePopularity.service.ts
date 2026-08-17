import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ArticleEvent, EVENT_TYPE, EventType } from '../entities/articleEvent.entity';
import { ArticlePopularity } from '../entities/articlePopularity.entity';

@Injectable()
export class ArticlePopularityService {

  constructor(
    @InjectRepository(ArticlePopularity)
    private readonly popularityRepo: Repository<ArticlePopularity>,
    private readonly dataSource: DataSource,
  ) { }

  private readonly logger = new Logger(ArticlePopularityService.name);

  /**
   * Record an event (view/share) for an article
   */
  async recordEvent(articleId: string, eventType: EventType, sessionId?: string): Promise<void> {
    if (!Object.values(EVENT_TYPE).includes(eventType)) {
      throw new BadRequestException(`Invalid event type. Must be one of: ${Object.values(EVENT_TYPE).join(', ')}`);
    }

    if (!articleId) {
      this.logger.warn('Attempted to record event without articleId');
      throw new BadRequestException('articleId is required');
    }

    try {
      const event = new ArticleEvent();
      event.articleId = articleId;
      event.eventType = eventType;
      event.sessionId = sessionId;

      await this.dataSource.getRepository(ArticleEvent).save(event);
    } catch (error) {
      this.logger.error('Failed to record article event', {
        articleId,
        eventType,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * Runs every hour to compute popularity scores for articles
   * based on events from the last 24 hours.
   * Score = (views × 1) + (shares × 5)
   */
  @Cron(CronExpression.EVERY_HOUR)
  async computePopularityScores(): Promise<void> {
    this.logger.log('Computing article popularity scores...');

    try {
      // Check database connection before proceeding
      if (!this.dataSource.isInitialized) {
        this.logger.error('Database connection is not initialized');
        return;
      }

      // Query events from the last 24 hours, grouped by article and event type
      const rawScores = await this.dataSource.query(
        `
        SELECT
          ae."articleId" as "articleId",
          COUNT(*) FILTER (WHERE ae."eventType" = $1) as "viewCount",
          COUNT(*) FILTER (WHERE ae."eventType" = $2) as "shareCount"
        FROM article_events ae
        WHERE ae."createdAt" >= NOW() - INTERVAL '24 hours'
        GROUP BY ae."articleId"
        `,
        [EVENT_TYPE.VIEW, EVENT_TYPE.SHARE],
      );

      this.logger.log(`Query returned ${rawScores?.length || 0} rows`);

      if (!rawScores?.length) {
        this.logger.log('No events found in the last 24 hours. Skipping popularity update.');
        return;
      }

      // Log first row for debugging
      this.logger.debug('First row data:', JSON.stringify(rawScores[0]));

      // Upsert scores into article_popularity table
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        let successCount = 0;
        for (const row of rawScores) {
          this.logger.debug(`Processing row: ${JSON.stringify(row)}`);

          if (!row.articleId) {
            this.logger.warn('Skipping row with missing articleId', { row });
            continue;
          }

          const viewCount = parseInt(row.viewCount, 10) || 0;
          const shareCount = parseInt(row.shareCount, 10) || 0;
          const score = viewCount * 1 + shareCount * 5;

          await queryRunner.manager.upsert(
            ArticlePopularity,
            {
              articleId: row.articleId,
              score,
              viewCount24h: viewCount,
              shareCount24h: shareCount,
              lastComputedAt: new Date(),
            },
            ['articleId'],
          );
          successCount++;
        }

        await queryRunner.commitTransaction();
        this.logger.log(`Popularity scores computed for ${successCount} articles.`);
      } catch (error) {
        await queryRunner.rollbackTransaction();
        this.logger.error('Failed to upsert popularity scores', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      this.logger.error('Failed to compute popularity scores', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }

}
