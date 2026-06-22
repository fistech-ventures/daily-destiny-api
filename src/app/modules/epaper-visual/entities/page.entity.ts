import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Edition } from './edition.entity';
import { Hotspot } from './hotspot.entity';

@Entity(ENUM_TABLE_NAMES.EPAPER_PAGES, { orderBy: { pageNumber: 'ASC' } })
export class Page extends BaseEntity {
  @ManyToOne(() => Edition, (edition) => edition.pages, { onDelete: 'CASCADE' })
  edition?: Edition;

  @RelationId((e: Page) => e.edition)
  @Column({ nullable: false })
  editionId?: string;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: false })
  pageNumber?: number;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: false })
  imageUrl?: string;

  @OneToMany(() => Hotspot, (hotspot) => hotspot.page, { cascade: true })
  hotspots?: Hotspot[];
}
