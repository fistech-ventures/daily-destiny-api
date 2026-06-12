import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Category } from './category.entity';

@Entity(ENUM_TABLE_NAMES.SUB_CATEGORIES, { orderBy: { createdAt: 'DESC' } })
export class SubCategory extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title', 'titleBn'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  title?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  titleBn?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  slug?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  slugBn?: string;

  @Column({ type: ENUM_COLUMN_TYPES.INT, default: 0 })
  position?: number;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: true, default: 0 })
  article?: number;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  category?: Category;

  @RelationId((e: SubCategory) => e.category)
  @Column({ nullable: false })
  categoryId?: string;
}
