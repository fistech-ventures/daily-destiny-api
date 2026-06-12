import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, RelationId } from 'typeorm';
import { Page } from './page.entity';

@Entity(ENUM_TABLE_NAMES.MENUS, { orderBy: { position: 'ASC' } })
export class Menu extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  title?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false })
  slug?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  externalUrl?: string;

  @OneToOne(() => Page, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'pageId' }) // ✅ This makes Menu the owning side
  @Type(() => Page)
  page?: Page;

  @RelationId((e: Menu) => e.page)
  @Column({ nullable: true })
  pageId?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false })
  language?: string;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: false, default: 0 })
  position?: number;

  @ManyToOne(() => Menu, (menu) => menu.childrens, { nullable: true, onDelete: 'CASCADE' })
  @Type(() => Menu)
  parent?: Menu;

  @RelationId((menu: Menu) => menu.parent)
  @Column({ nullable: true })
  parentId?: string;

  @OneToMany(() => Menu, (menu) => menu.parent)
  @Type(() => Menu)
  childrens?: Menu[];
}
