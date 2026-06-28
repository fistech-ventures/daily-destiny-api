import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Article } from '../../article/entities/article.entity';

@Entity(ENUM_TABLE_NAMES.SPECIAL_EVENTS, { orderBy: { createdAt: 'DESC' } })
export class SpecialEvent extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  title?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false, unique: true })
  slug?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  bannerImage?: string;

  @ManyToMany(() => Article)
  @JoinTable({
    name: ENUM_TABLE_NAMES.SPECIAL_EVENT_ARTICLES,
    joinColumn: { name: 'specialEventId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'articleId', referencedColumnName: 'id' },
  })
  articles?: Article[];
}
