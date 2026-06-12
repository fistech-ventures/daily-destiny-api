import { ENUM_COLUMN_TYPES } from '@src/shared';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IAuthUser } from '../interfaces';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: ENUM_COLUMN_TYPES.BOOLEAN, default: true })
  isActive?: boolean;

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, nullable: true, default: {} })
  createdBy?: IAuthUser;

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, nullable: true, default: {} })
  updatedBy?: IAuthUser;

  @Column({ type: ENUM_COLUMN_TYPES.JSONB, nullable: true, select: false, default: {} })
  deletedBy?: IAuthUser;

  @CreateDateColumn({ type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC })
  createdAt?: Date;

  @UpdateDateColumn({ type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC })
  updatedAt?: Date;

  @DeleteDateColumn({ type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC, select: false })
  deletedAt?: Date;
}
