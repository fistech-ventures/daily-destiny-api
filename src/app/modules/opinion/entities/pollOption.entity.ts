import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Poll } from './poll.entity';

@Entity(ENUM_TABLE_NAMES.POLL_OPTIONS, { orderBy: { position: 'ASC' } })
export class PollOption extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = [];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false })
  title?: string;

  @ManyToOne(() => Poll, { onDelete: 'CASCADE' })
  @Type(() => Poll)
  poll?: Poll;

  @RelationId((e: PollOption) => e.poll)
  @Column({ nullable: false })
  pollId?: string;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: false, default: 0 })
  position?: number;

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: false, default: 0 })
  voteCount?: number;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 5, nullable: false, default: '0%' })
  votePercentage?: number;
}
