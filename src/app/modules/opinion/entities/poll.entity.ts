import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Author } from '../../author/entities/author.entity';
import { ENUM_ARTICLE_STATUS } from '../const';
import { PollOption } from './pollOption.entity';

@Entity(ENUM_TABLE_NAMES.POLLS, { orderBy: { createdAt: 'DESC' } })
export class Poll extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['statement'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  statement?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false })
  slug?: string;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: true })
  position?: number;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  coverImage?: string;

  @Column({ type: ENUM_COLUMN_TYPES.TEXT, nullable: true })
  details?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false })
  language?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true, default: ENUM_ARTICLE_STATUS.DRAFTED })
  status?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  date?: string;

  @ManyToOne(() => Author, { onDelete: 'CASCADE' })
  @Type(() => Author)
  author?: Author;

  @RelationId((e: Poll) => e.author)
  @Column({ nullable: false })
  authorId?: string;

  @OneToMany(() => PollOption, (item) => item.poll, { cascade: true })
  @Type(() => PollOption)
  options?: PollOption[];
}
