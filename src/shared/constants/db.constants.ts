import { TableColumnOptions } from 'typeorm';

export enum ENUM_TABLE_NAMES {
  GALLERY = 'gallery',

  GLOBAL_CONFIGS = 'global_configs',
  PERMISSIONS = 'permissions',
  PERMISSION_TYPES = 'permission_types',
  ROLES = 'roles',
  USERS = 'users',
  USER_PROFILES = 'user_profiles',
  USER_ROLES = 'user_roles',
  ROLE_PERMISSIONS = 'role_permissions',

  // notification module tables
  SMS_GATEWAYS = 'sms_gateways',
  EMAIL_GATEWAYS = 'email_gateways',

  // common tables
  AREAS = 'areas',
  CITIES = 'cities',
  CATEGORIES = 'categories',
  SUB_CATEGORIES = 'sub_categories',
  TAGS = 'tags',
  TAG_ALIAS = 'tag_alias',

  // core
  AUTHORS = 'authors',
  ARTICLES = 'articles',
  ARTICLE_MEDIAS = 'article_medias',
  ARTICLE_TAGS = 'article_tags',
  ARTICLE_LOCATIONS = 'article_locations',
  LOCATIONS = 'locations',
  MARKET_PRICES = 'market_prices',
  OPINIONS = 'opinions',
  POLLS = 'polls',
  POLL_OPTIONS = 'poll_options',
  ENTREPRENEURS = 'entrepreneurs',
  STARTUPS = 'statups',
  STARTUP_FOUNDERS = 'startup_founders',
  ADS = 'ads',
  AD_REQUESTS = 'ad_requests',

  // cms
  MENUS = 'menus',
  HERO_BANNERS = 'hero_banners',
  PAGES = 'pages',
  SECTIONS = 'sections',
  LAYOUTS = 'layouts',
  LAYOUT_COLUMNS = 'layout_columns',
  SECTION_ITEMS = 'section_items',
  PAGE_SECTIONS = 'page_sections',
  SLIDES = 'slides',
  SLIDER_ITEMS = 'slider_items',
  CONTENTS = 'contents',
}

export enum ENUM_COLUMN_TYPES {
  PRIMARY_KEY = 'uuid',
  INT = 'int',
  FLOAT = 'float',
  TEXT = 'text',
  VARCHAR = 'varchar',
  BOOLEAN = 'boolean',
  DATE = 'date',
  TIMESTAMP_UTC = 'timestamp without time zone',
  ENUM = 'enum',
  JSONB = 'jsonb',
}

export const defaultDateTimeColumns: TableColumnOptions[] = [
  {
    name: 'createdAt',
    type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC,
    default: 'NOW()',
    isNullable: true,
  },
  {
    name: 'updatedAt',
    type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC,
    isNullable: true,
  },
];

export const defaultColumns: TableColumnOptions[] = [];

export const defaultPrimaryColumn: TableColumnOptions = {
  name: 'id',
  type: ENUM_COLUMN_TYPES.PRIMARY_KEY,
  isPrimary: true,
  generationStrategy: 'uuid',
  default: 'uuid_generate_v4()',
  isUnique: true,
};
