import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { ENUM_LOCATION_TYPE } from '@src/shared/enums/common.enums';
import { Column, Entity, RelationId, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity(ENUM_TABLE_NAMES.LOCATIONS)
@Tree('nested-set')
export class Location extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['name', 'nameBn', 'slug'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: false })
  name?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 250, nullable: true })
  nameBn?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false, unique: true })
  slug?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: false, enum: ENUM_LOCATION_TYPE })
  type?: ENUM_LOCATION_TYPE;

  @TreeParent()
  parent?: Location;

  @RelationId((e: Location) => e.parent)
  @Column({ nullable: true })
  parentId?: string;

  @TreeChildren()
  children?: Location[];

  @Column({ type: ENUM_COLUMN_TYPES.INT, nullable: true, default: 0 })
  position?: number;
}
