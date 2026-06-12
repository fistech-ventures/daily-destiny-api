import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { StartupFounder } from './startupFounders.entity';

@Entity(ENUM_TABLE_NAMES.ENTREPRENEURS, { orderBy: { createdAt: 'DESC' } })
export class Entrepreneur extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['name'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  name?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  image?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 100, nullable: true })
  designation?: string;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: true, default: 0 })
  article?: number;

  @OneToMany(() => StartupFounder, (e) => e.company)
  @Type(() => StartupFounder)
  companies?: StartupFounder[];
}
