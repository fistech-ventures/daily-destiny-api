import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity } from 'typeorm';
import { ENUM_AD_STATUS } from '../const';

@Entity(ENUM_TABLE_NAMES.ADS, { orderBy: { createdAt: 'DESC' } })
export class Ad extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  title?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false })
  type?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  imageUrl?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  videoUrl?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  scriptEmbedCode?: string; // for iframe, third-party embeds?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  redirectUrl?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true, default: ENUM_AD_STATUS.DRAFTED })
  status?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  startDate?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  endDate?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  pageType?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  position?: string;

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, nullable: true })
  categories?: string[];
}
