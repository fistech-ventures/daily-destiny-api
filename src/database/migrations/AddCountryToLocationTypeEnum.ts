import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCountryToLocationTypeEnum1736640000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add 'country' to the enum type for locations.type column
    // PostgreSQL allows adding values to enums if they're not used in constraints
    await queryRunner.query(`
      ALTER TYPE "enum_locations_type" ADD VALUE IF NOT EXISTS 'country';
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL doesn't support removing enum values directly
    // To rollback, we would need to:
    // 1. Create a new enum type without 'country'
    // 2. Alter the column to use the new enum type
    // 3. Drop the old enum type
    // However, this is complex and may not be necessary for this use case
    // For now, we'll note that this migration is not easily reversible

    // If rollback is needed, the manual process would be:
    /*
    await queryRunner.query(`
      ALTER TYPE "enum_locations_type" RENAME TO "enum_locations_type_old";
      CREATE TYPE "enum_locations_type" AS ENUM (
        'division',
        'district',
        'upazilla',
        'union',
        'city_corporation',
        'pourosova'
      );
      ALTER TABLE "locations" 
        ALTER COLUMN "type" TYPE "enum_locations_type" 
        USING "type"::text::"enum_locations_type";
      DROP TYPE "enum_locations_type_old";
    `);
    */

    // For now, we'll throw an error indicating manual intervention is needed
    throw new Error('Rollback for this migration requires manual intervention. See migration file for details.');
  }
}
