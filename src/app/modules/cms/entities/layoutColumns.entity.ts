import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Layout } from './layout.entity';

@Entity(ENUM_TABLE_NAMES.LAYOUT_COLUMNS, { orderBy: { position: 'ASC' } })
export class LayoutColumn extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = [];

  @ManyToOne(() => Layout, { onDelete: 'CASCADE' })
  @Type(() => Layout)
  layout?: Layout;

  @RelationId((e: LayoutColumn) => e.layout)
  @Column({ nullable: false })
  layoutId?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  type?: string;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: false, default: 0 })
  span?: number;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: false, default: 0 })
  position?: number;

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, nullable: false, default: [] })
  childrens?: any;
}
