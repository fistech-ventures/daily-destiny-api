import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity } from 'typeorm';

@Entity(ENUM_TABLE_NAMES.EPAPERS, { orderBy: { date: 'DESC', pageNumber: 'ASC' } })
export class Epaper extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['publicationName', 'title'];

  @Column({ type: ENUM_COLUMN_TYPES.DATE, nullable: false })
  date?: Date;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: false })
  pageNumber?: number;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 255, nullable: false })
  imageUrl?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 255, nullable: false })
  imageKey?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 255, nullable: false })
  publicationName?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 255, nullable: true })
  title?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 50, nullable: false })
  mimetype?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 10, nullable: false })
  extension?: string;

  @Column({ type: ENUM_COLUMN_TYPES.BOOLEAN, default: true })
  isActive?: boolean;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: true })
  fileSize?: number;
}
