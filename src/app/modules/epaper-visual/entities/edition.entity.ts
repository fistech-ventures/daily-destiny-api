import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Page } from './page.entity';

export enum ENUM_EDITION_STATUS {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity(ENUM_TABLE_NAMES.EDITIONS, { orderBy: { publishDate: 'DESC' } })
export class Edition extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['publishDate'];

  @Index({ unique: true })
  @Column({ type: ENUM_COLUMN_TYPES.DATE, nullable: false, unique: true })
  publishDate?: Date;

  @Column({
    type: ENUM_COLUMN_TYPES.VARCHAR,
    length: 20,
    nullable: false,
    default: ENUM_EDITION_STATUS.DRAFT,
  })
  status?: string;

  @OneToMany(() => Page, (page) => page.edition, { cascade: true })
  pages?: Page[];
}
