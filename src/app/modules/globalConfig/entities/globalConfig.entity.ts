import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity } from 'typeorm';
import { IGlobalConfigIdentity } from '../const';

@Entity(ENUM_TABLE_NAMES.GLOBAL_CONFIGS, { orderBy: { createdAt: 'DESC' } })
export class GlobalConfig extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = [];

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, nullable: true })
  identity?: IGlobalConfigIdentity;

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, nullable: true })
  trackingCodes?: Record<string, string>;

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, nullable: true })
  trackingScripts?: string[];

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, nullable: true })
  meta?: Record<string, any>;
}
