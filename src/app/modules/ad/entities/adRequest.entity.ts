import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity } from 'typeorm';

@Entity(ENUM_TABLE_NAMES.AD_REQUESTS, { orderBy: { createdAt: 'DESC' } })
export class AdRequest extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['contactName', 'contactNo', 'contactEmail'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  contactName?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  contactNo?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  contactEmail?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  type?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  description?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  assets?: string; // zipped file url / drive link;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: false, default: 0 })
  billAmount?: number;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: false, default: 0 })
  paidAmount?: number;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: false, default: 0 })
  dueAmount?: number;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  startDate?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  endDate?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false, default: 'pending' })
  status?: string;
}
