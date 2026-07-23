import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropRequestIdFromAd1721089600002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ads 
      DROP COLUMN IF EXISTS "requestId";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ads 
      ADD COLUMN IF NOT EXISTS "requestId" VARCHAR;
    `);
  }
}
