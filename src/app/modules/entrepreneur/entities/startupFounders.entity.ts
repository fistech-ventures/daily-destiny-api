import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Entrepreneur } from './entrepreneur.entity';
import { Startup } from './startup.entity';

@Entity(ENUM_TABLE_NAMES.STARTUP_FOUNDERS, { orderBy: { createdAt: 'DESC' } })
export class StartupFounder extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = [];

  @ManyToOne(() => Startup, { onDelete: 'CASCADE' })
  @Type(() => Startup)
  company?: Startup;

  @RelationId((e: StartupFounder) => e.company)
  @Column({ nullable: false })
  companyId?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  designation?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  joined?: string;

  @ManyToOne(() => Entrepreneur, { onDelete: 'CASCADE' })
  @Type(() => Entrepreneur)
  founder?: Entrepreneur;

  @RelationId((e: StartupFounder) => e.founder)
  @Column({ nullable: false })
  founderId?: string;
}
