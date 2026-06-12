import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity } from 'typeorm';

@Entity(ENUM_TABLE_NAMES.AUTHORS, { orderBy: { createdAt: 'DESC' } })
export class Author extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['name', 'nameBn'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  name?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  nameBn?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  image?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 100, nullable: true })
  designation?: string;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: true, default: 0 })
  article?: number;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 100, nullable: true })
  designationBn?: string;
}
