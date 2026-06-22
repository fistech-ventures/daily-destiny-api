import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ArticlePopularity } from '../entities/articlePopularity.entity';
import { ArticleEvent, EVENT_TYPE, EventType } from '../entities/articleEvent.entity';

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

    const event = new ArticleEvent();
    event.articleId = articleId;
    event.eventType = eventType;
    event.sessionId = sessionId;

    await this.dataSource.getRepository(ArticleEvent).save(event);
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
      // Query events from the last 24 hours, grouped by article and event type
      const rawScores = await this.dataSource.query(
        `
        SELECT
          ae."articleId",
          COUNT(*) FILTER (WHERE ae."eventType" = $1) AS "viewCount",
          COUNT(*) FILTER (WHERE ae."eventType" = $2) AS "shareCount"
        FROM article_events ae
        WHERE ae."createdAt" >= NOW() - INTERVAL '24 hours'
        GROUP BY ae."articleId"
        `,
        [EVENT_TYPE.VIEW, EVENT_TYPE.SHARE],
      );

      if (!rawScores?.length) {
        this.logger.log('No events found in the last 24 hours. Skipping popularity update.');
        return;
      }

      // Upsert scores into article_popularity table
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        for (const row of rawScores) {
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
        }

        await queryRunner.commitTransaction();
        this.logger.log(`Popularity scores computed for ${rawScores.length} articles.`);
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      this.logger.error('Failed to compute popularity scores', error);
    }
  }

}
