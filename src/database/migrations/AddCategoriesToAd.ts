import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoriesToAd1721089600003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ads 
      ADD COLUMN IF NOT EXISTS "categories" JSONB DEFAULT '[]'::jsonb;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ads 
      DROP COLUMN IF EXISTS "categories";
    `);
  }
}
