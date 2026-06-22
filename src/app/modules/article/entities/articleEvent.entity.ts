import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Article } from './article.entity';

export const EVENT_TYPE = {
  VIEW: 'view',
  SHARE: 'share',
} as const;

export type EventType = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];

@Entity(ENUM_TABLE_NAMES.ARTICLE_EVENTS)
export class ArticleEvent {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'articleId' })
  article?: Article;

  @RelationId((e: ArticleEvent) => e.article)
  articleId!: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 50 })
  eventType!: EventType;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 255, nullable: true })
  sessionId?: string;

  @CreateDateColumn({ type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC })
  createdAt?: Date;
}
