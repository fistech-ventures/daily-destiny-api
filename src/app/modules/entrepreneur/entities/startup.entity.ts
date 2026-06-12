import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { StartupFounder } from './startupFounders.entity';

@Entity(ENUM_TABLE_NAMES.STARTUPS, { orderBy: { createdAt: 'DESC' } })
export class Startup extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['name', 'nameBn'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  name?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  logo?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  established?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  category?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  brief?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  website?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  email?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  phoneNumber?: string;

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, nullable: true })
  address?: any;

  @OneToMany(() => StartupFounder, (e) => e.company)
  @Type(() => StartupFounder)
  founders?: StartupFounder[];
}
