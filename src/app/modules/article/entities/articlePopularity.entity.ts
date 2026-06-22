import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from 'typeorm';
import { Article } from './article.entity';

@Entity(ENUM_TABLE_NAMES.ARTICLE_POPULARITY)
export class ArticlePopularity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @OneToOne(() => Article, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'articleId' })
  article?: Article;

  @RelationId((e: ArticlePopularity) => e.article)
  articleId!: string;

  @Column({ type: ENUM_COLUMN_TYPES.FLOAT, default: 0 })
  score!: number;

  @Column({ name: 'viewCount24h', type: ENUM_COLUMN_TYPES.INT, default: 0 })
  viewCount24h!: number;

  @Column({ name: 'shareCount24h', type: ENUM_COLUMN_TYPES.INT, default: 0 })
  shareCount24h!: number;

  @Column({ name: 'lastComputedAt', type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC, default: () => 'NOW()' })
  lastComputedAt?: Date;

  @CreateDateColumn({ type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC })
  createdAt?: Date;

  @UpdateDateColumn({ type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC })
  updatedAt?: Date;
}
