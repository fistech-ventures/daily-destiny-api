import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Ad } from '../../ad/entities/ad.entity';
import { Article } from '../../article/entities/article.entity';
import { Section } from './section.entity';

@Entity(ENUM_TABLE_NAMES.SECTION_ITEMS, { orderBy: { position: 'ASC' } })
export class SectionItem extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = [];

  @ManyToOne(() => Section, { onDelete: 'CASCADE' })
  @Type(() => Section)
  section?: Section;

  @RelationId((e: SectionItem) => e.section)
  @Column({ nullable: false })
  sectionId?: string;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: false, default: 0 })
  position?: number;

  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  @Type(() => Article)
  article?: Article;

  @RelationId((e: SectionItem) => e.article)
  @Column({ nullable: true })
  articleId?: string;

  @ManyToOne(() => Ad, { onDelete: 'CASCADE' })
  @Type(() => Ad)
  ad?: Ad;

  @RelationId((e: SectionItem) => e.ad)
  @Column({ nullable: true })
  adId?: string;
}
