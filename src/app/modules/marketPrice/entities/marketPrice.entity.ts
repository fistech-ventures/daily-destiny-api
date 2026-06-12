import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity } from 'typeorm';

@Entity(ENUM_TABLE_NAMES.MARKET_PRICES, { orderBy: { position: 'ASC' } })
export class MarketPrice extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title', 'titleBn'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  title?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  titleBn?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  image?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false, })
  priceRange?: string;

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, nullable: true, default: {} })
  sparkline?: any;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: false, default: 0 })
  position?: number;
}
