import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpecialEventTables1741219200001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create special_events table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS special_events (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        title VARCHAR(250) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        "bannerImage" TEXT,
        "isActive" BOOLEAN DEFAULT TRUE,
        "createdBy" JSONB DEFAULT '{}',
        "updatedBy" JSONB DEFAULT '{}',
        "deletedBy" JSONB DEFAULT '{}',
        "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
        "deletedAt" TIMESTAMP WITHOUT TIME ZONE
      );
    `);

    // Create the join table for many-to-many relationship with articles
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS special_event_articles (
        "specialEventId" uuid NOT NULL REFERENCES special_events(id) ON DELETE CASCADE,
        "articleId" uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
        PRIMARY KEY ("specialEventId", "articleId")
      );
    `);

    // Index for faster reverse lookup (find events by article)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_special_event_articles_article
      ON special_event_articles ("articleId");
    `);

    // Index on slug for fast public lookups
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_special_events_slug
      ON special_events (slug);
    `);

    // Index on isActive for filtering active events
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_special_events_active
      ON special_events ("isActive");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS special_event_articles CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS special_events CASCADE;`);
  }
}
