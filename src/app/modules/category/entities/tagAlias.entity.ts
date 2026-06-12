import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Tag } from './tag.entity';
import { ENUM_ARTICLE_LANGUAGE } from '../../article/const';

@Entity(ENUM_TABLE_NAMES.TAG_ALIAS, { orderBy: { article: 'DESC' } })
export class TagAlias extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false, unique: true })
  title?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 50, nullable: false, default: ENUM_ARTICLE_LANGUAGE.BENGALI })
  language?: string;
  
  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  tag?: Tag;
  
  @RelationId((e: TagAlias) => e.tag)
  @Column({ nullable: false })
  tagId?: string;
}
