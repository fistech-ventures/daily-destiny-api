import { BaseEntity } from '@src/app/base';
import { ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Article } from './article.entity';
import { Tag } from '../../category/entities/tag.entity';

@Entity(ENUM_TABLE_NAMES.ARTICLE_TAGS, { orderBy: { createdAt: 'DESC' } })
export class ArticleTag extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title', 'code'];

  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  article?: Article;

  @RelationId((e: ArticleTag) => e.article)
  @Column({ nullable: false })
  articleId?: string;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  tag?: Tag;

  @RelationId((e: ArticleTag) => e.tag)
  @Column({ nullable: false })
  tagId?: string;
}
