import { BaseEntity } from '@src/app/base';
import { IAuthUser } from '@src/app/interfaces';
import { ISeoMeta } from '@src/app/interfaces/seoMetaData.interface';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Author } from '../../author/entities/author.entity';
import { Category } from '../../category/entities/category.entity';
import { SubCategory } from '../../category/entities/subCategory.entity';
import { ArticleLocation } from '../../location/entities/articleLocation.entity';
import { ENUM_ARTICLE_STATUS } from '../const';
import { ArticleMedia } from './articleMedia.entity';

@Entity(ENUM_TABLE_NAMES.ARTICLES, { orderBy: { createdAt: 'DESC' } })
export class Article extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title', 'code'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  title?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true, unique: true })
  code?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false, unique: true })
  slug?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false })
  type?: string;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: true })
  position?: number;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  coverImage?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  coverImageCredit?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  excerpt?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  details?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false })
  language?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true, default: ENUM_ARTICLE_STATUS.DRAFTED })
  status?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  date?: string;

  @Column({ type: ENUM_COLUMN_TYPES.BOOLEAN, default: false })
  isExclusive?: boolean;

  @Column({ type: ENUM_COLUMN_TYPES.BOOLEAN, default: false })
  isFeatured?: boolean;

  @ManyToOne(() => Author, { onDelete: 'CASCADE' })
  @Type(() => Author)
  author?: Author;

  @RelationId((e: Article) => e.author)
  @Column({ nullable: true })
  authorId?: string;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @Type(() => Category)
  category?: Category;

  @RelationId((e: Article) => e.category)
  @Column({ nullable: true })
  categoryId?: string;

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'article_categories',
    joinColumn: { name: 'articleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories?: Category[];

  @ManyToOne(() => SubCategory, { onDelete: 'CASCADE' })
  @Type(() => SubCategory)
  subCategory?: SubCategory;

  @RelationId((e: Article) => e.subCategory)
  @Column({ nullable: true })
  subCategoryId?: string;

  @ManyToMany(() => SubCategory)
  @JoinTable({
    name: 'article_sub_categories',
    joinColumn: { name: 'articleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'subCategoryId', referencedColumnName: 'id' },
  })
  subCategories?: SubCategory[];

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, default: [] })
  tags?: any;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  publishedAt?: string;

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, default: null })
  publishedBy?: IAuthUser;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  archivedAt?: string;

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, default: null })
  archivedBy?: IAuthUser;

  @OneToMany(() => ArticleMedia, (e) => e.article)
  medias?: ArticleMedia[];

  @OneToMany(() => ArticleLocation, (e) => e.article)
  @Type(() => ArticleLocation)
  locations?: ArticleLocation[];

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, default: null })
  seoMetaData?: ISeoMeta;
}
