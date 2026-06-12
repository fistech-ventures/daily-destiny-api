import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { Location } from './location.entity';

@Entity(ENUM_TABLE_NAMES.ARTICLE_LOCATIONS)
export class ArticleLocation {
  @PrimaryColumn({ type: ENUM_COLUMN_TYPES.VARCHAR })
  articleId?: string;

  @PrimaryColumn({ type: ENUM_COLUMN_TYPES.VARCHAR })
  locationId?: string;

  @ManyToOne(() => Article, (article) => article.locations, { onDelete: 'CASCADE' })
  article?: Article;

  @ManyToOne(() => Location, { onDelete: 'CASCADE' })
  location?: Location;

  @Column({ type: ENUM_COLUMN_TYPES.BOOLEAN, default: false })
  isPrimary?: boolean;

  @Column({ type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC, default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
