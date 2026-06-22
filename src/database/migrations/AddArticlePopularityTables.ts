import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddArticlePopularityTables1741219200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create article_events table - logs every view/share per article
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS article_events (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        "articleId" uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
        "eventType" VARCHAR(50) NOT NULL CHECK ("eventType" IN ('view', 'share')),
        "sessionId" VARCHAR(255),
        "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
      );
    `);

    // Index for efficient querying of last 24h events grouped by article
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_article_events_article_time
      ON article_events ("articleId", "createdAt");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_article_events_type_time
      ON article_events ("eventType", "createdAt");
    `);

    // Create article_popularity table - precomputed scores
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS article_popularity (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        "articleId" uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE UNIQUE,
        score FLOAT DEFAULT 0,
        "viewCount24h" INT DEFAULT 0,
        "shareCount24h" INT DEFAULT 0,
        "lastComputedAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
        "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_article_popularity_score
      ON article_popularity (score DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS article_popularity CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS article_events CASCADE;`);
  }
}
