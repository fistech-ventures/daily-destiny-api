import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHangerToArticle1721089600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS "hanger" TEXT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE articles 
      DROP COLUMN IF EXISTS "hanger";
    `);
  }
}
