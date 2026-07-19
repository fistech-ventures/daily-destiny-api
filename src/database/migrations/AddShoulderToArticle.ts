import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShoulderToArticle1721099600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS "shoulder" TEXT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE articles 
      DROP COLUMN IF EXISTS "shoulder";
    `);
  }
}
