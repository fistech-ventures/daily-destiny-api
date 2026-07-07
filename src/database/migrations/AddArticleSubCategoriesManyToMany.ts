import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddArticleSubCategoriesManyToMany1741305700000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the join table for many-to-many relationship between articles and sub_categories
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS article_sub_categories (
        "articleId" uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
        "subCategoryId" uuid NOT NULL REFERENCES sub_categories(id) ON DELETE CASCADE,
        PRIMARY KEY ("articleId", "subCategoryId")
      );
    `);

    // Index for faster reverse lookup (find articles by subCategory)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_article_sub_categories_sub_category
      ON article_sub_categories ("subCategoryId");
    `);

    // Index for faster lookup by article
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_article_sub_categories_article
      ON article_sub_categories ("articleId");
    `);

    // Migrate existing subCategoryId values from articles into the join table
    await queryRunner.query(`
      INSERT INTO article_sub_categories ("articleId", "subCategoryId")
      SELECT id, "subCategoryId" FROM articles
      WHERE "subCategoryId" IS NOT NULL
      ON CONFLICT DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS article_sub_categories CASCADE;`);
  }
}
