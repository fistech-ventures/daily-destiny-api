import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { LayoutColumn } from './layoutColumns.entity';

@Entity(ENUM_TABLE_NAMES.LAYOUTS, { orderBy: { position: 'ASC' } })
export class Layout extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title'];

  // @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  // title?: string;

  // @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: true })
  // subTitle?: string;

  // @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: true })
  // redirectTo?: string;

  // @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: true })
  // banner?: string;

  // @Column({ type: ENUM_COLUMN_TYPES.BOOLEAN, default: false })
  // isDefaultHomeSection?: boolean;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  type?: string;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: false, default: 0 })
  position?: number;

  @OneToMany(() => LayoutColumn, (item) => item.layout, { cascade: true })
  @Type(() => LayoutColumn)
  columns?: LayoutColumn[];
}
