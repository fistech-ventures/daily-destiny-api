import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddArticleCategoriesManyToMany1741305600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the join table for many-to-many relationship between articles and categories
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS article_categories (
        "articleId" uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
        "categoryId" uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY ("articleId", "categoryId")
      );
    `);

    // Index for faster reverse lookup (find articles by category)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_article_categories_category
      ON article_categories ("categoryId");
    `);

    // Index for faster lookup by article
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_article_categories_article
      ON article_categories ("articleId");
    `);

    // Migrate existing categoryId values from articles into the join table
    await queryRunner.query(`
      INSERT INTO article_categories ("articleId", "categoryId")
      SELECT id, "categoryId" FROM articles
      WHERE "categoryId" IS NOT NULL
      ON CONFLICT DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS article_categories CASCADE;`);
  }
}
