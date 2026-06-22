import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Page } from './page.entity';

@Entity(ENUM_TABLE_NAMES.HOTSPOTS)
export class Hotspot extends BaseEntity {
  @ManyToOne(() => Page, (page) => page.hotspots, { onDelete: 'CASCADE' })
  page?: Page;

  @RelationId((e: Hotspot) => e.page)
  @Column({ nullable: false })
  pageId?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 255, nullable: true })
  title?: string;

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, nullable: false })
  coordinates?: { x: number; y: number; width: number; height: number };
}
