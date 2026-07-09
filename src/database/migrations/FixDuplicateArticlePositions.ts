import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixDuplicateArticlePositions1741401600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Renumber all articles with a position sequentially using ROW_NUMBER
    // This resolves any duplicate positions (e.g., three articles at position 4)
    // by assigning unique sequential positions ordered by current position and createdAt
    await queryRunner.query(`
      WITH numbered AS (
        SELECT id,
               ROW_NUMBER() OVER (ORDER BY position ASC, "createdAt" ASC) - 1 AS new_position
        FROM articles
        WHERE position IS NOT NULL
      )
      UPDATE articles a
      SET position = n.new_position
      FROM numbered n
      WHERE a.id = n.id;
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // No way to restore original positions — this is a one-way fix
  }
}
