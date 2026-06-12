import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity, OneToMany } from 'typeorm';
import { SubCategory } from './subCategory.entity';
import { ISeoMeta } from '@src/app/interfaces/seoMetaData.interface';

@Entity(ENUM_TABLE_NAMES.CATEGORIES, { orderBy: { createdAt: 'DESC' } })
export class Category extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title', 'titleBn'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  title?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  titleBn?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  slug?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  slugBn?: string;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: true, default: 0 })
  article?: number;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: true })
  position?: number;

  @OneToMany(() => SubCategory, (e) => e.category)
  subCategories?: SubCategory[];

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, default: null })
  seoMetaData?: ISeoMeta;
}
