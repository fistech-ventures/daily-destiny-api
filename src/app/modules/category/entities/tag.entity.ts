import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity } from 'typeorm';

@Entity(ENUM_TABLE_NAMES.TAGS, { orderBy: { article: 'DESC' } })
export class Tag extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title', 'canonicalId'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false, unique: true })
  title?: string;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: true, default: 0 })
  article?: number;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: true, unique: true })
  canonicalId?: string;
}
