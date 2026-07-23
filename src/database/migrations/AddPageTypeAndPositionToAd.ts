import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPageTypeAndPositionToAd1721089600001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ads 
      ADD COLUMN IF NOT EXISTS "pageType" VARCHAR,
      ADD COLUMN IF NOT EXISTS "position" VARCHAR;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ads 
      DROP COLUMN IF EXISTS "pageType",
      DROP COLUMN IF EXISTS "position";
    `);
  }
}
