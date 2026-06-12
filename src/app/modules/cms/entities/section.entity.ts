import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Page } from './page.entity';
import { SectionItem } from './sectionItems.entity';

@Entity(ENUM_TABLE_NAMES.SECTIONS, { orderBy: { position: 'ASC' } })
export class Section extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  title?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: true })
  subTitle?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: true })
  redirectTo?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: true })
  banner?: string;

  @Column({ type: ENUM_COLUMN_TYPES.BOOLEAN, default: false })
  isDefaultHomeSection?: boolean;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false })
  type?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false })
  layout?: string;

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, nullable: true })
  config?: any;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  @Type(() => Page)
  page?: Page;

  @RelationId((e: Section) => e.page)
  @Column({ nullable: true })
  pageId?: string;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: false, default: 0 })
  position?: number;

  @OneToMany(() => SectionItem, (item) => item.section)
  @Type(() => SectionItem)
  items?: SectionItem[];
}
