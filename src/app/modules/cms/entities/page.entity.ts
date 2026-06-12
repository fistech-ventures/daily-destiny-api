import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Menu } from './menu.entity';
import { PageSection } from './pageSection.entity';

@Entity(ENUM_TABLE_NAMES.PAGES, { orderBy: { createdAt: 'DESC' } })
export class Page extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  title?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, unique: true, nullable: false })
  slug?: string;

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, nullable: true, default: [] })
  layouts?: any;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  contentType?: string;

  @OneToOne(() => Menu, (menu) => menu.page, { nullable: true })
  @Type(() => Menu)
  menu?: Menu;

  @Column({ nullable: true })
  menuId?: string;

  @OneToMany(() => PageSection, (section) => section.page)
  @Type(() => PageSection)
  sections?: PageSection[];
}
