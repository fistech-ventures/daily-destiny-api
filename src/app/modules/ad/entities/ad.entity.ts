import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { ENUM_AD_STATUS } from '../const';
import { AdRequest } from './adRequest.entity';

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

  @ManyToOne(() => AdRequest, { onDelete: 'CASCADE' })
  @Type(() => AdRequest)
  request?: AdRequest;

  @RelationId((e: Ad) => e.request)
  @Column({ nullable: false })
  requestId?: string;
}
