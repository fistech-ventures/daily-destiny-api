# Integrate `shoulder` Field into Admin Panel

## Overview

A new `shoulder` field has been added to the `articles` table (analogous to the existing `hanger` field). This guide explains how to add support for it in your admin panel frontend.

---

## 1. Migration

Before integrating the field in the frontend, **run the migration** to add the column to the database:

```bash
# Using TypeORM CLI
npx typeorm migration:run

# Or if you have a custom migration script
yarn migration:run
```

This will execute `src/database/migrations/AddShoulderToArticle.ts` and add the `shoulder` TEXT column to the `articles` table.

---

## 2. API – New/Updated Endpoints

The shoulder field is already wired up in the API. No changes needed on the server side.

### Create Article (`POST /internal/articles`)

| Field      | Type   | Required | Description       |
|------------|--------|----------|-------------------|
| `shoulder` | string | No       | Shoulder text     |

**Example payload:**
```json
{
  "title": "News Title",
  "shoulder": "Breaking News Shoulder",
  "hanger": "Main Headline Hanger",
  ...
}
```

### Update Article (`PATCH /internal/articles/:id`)

| Field      | Type   | Required | Description       |
|------------|--------|----------|-------------------|
| `shoulder` | string | No       | Shoulder text     |

**Example payload:**
```json
{
  "shoulder": "Updated Shoulder Text"
}
```

### Filter/List Articles (`GET /web/articles` & `GET /internal/articles`)

| Field      | Type   | Description                    |
|------------|--------|--------------------------------|
| `shoulder` | string | Filter by shoulder text (ILIKE) |

**Example:**
```
GET /web/articles?shoulder=breaking
```

---

## 3. Admin Panel UI Integration

### 3.1 Article Create/Edit Form

Add a **Shoulder** text input field next to or below the existing **Hanger** field.

#### Suggested placement

```
┌─────────────────────────────────────┐
│  Article Create / Edit              │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ Hanger                       │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ Shoulder                     │   │   ← NEW
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ Title                        │   │
│  └──────────────────────────────┘   │
│  ...                               │
└─────────────────────────────────────┘
```

#### Field configuration

| Property       | Value                |
|----------------|----------------------|
| **Label**      | Shoulder             |
| **Name**       | `shoulder`           |
| **Type**       | Text input / Textarea |
| **Placeholder**| e.g., "Enter shoulder text" |
| **Required**   | No                   |
| **Max Length** | Unlimited (TEXT)     |

#### Example (React)

```tsx
// Before: hanger field
<FormField label="Hanger" name="hanger">
  <Input placeholder="Enter hanger text" />
</FormField>

// After: add shoulder field
<FormField label="Shoulder" name="shoulder">
  <Input placeholder="Enter shoulder text" />
</FormField>
```

### 3.2 Article List / Table View

Add a **Shoulder** column to the article listing table, ideally next to the **Hanger** column.

**Example column config:**
```tsx
{
  title: 'Shoulder',
  dataIndex: 'shoulder',
  key: 'shoulder',
  ellipsis: true, // Truncate long text
  render: (text: string) => text || '—',
}
```

### 3.3 Article Detail / Single View

Display the shoulder field in the article detail view, placed near the hanger field.

```tsx
<div className="article-meta">
  {article.hanger && <div><strong>Hanger:</strong> {article.hanger}</div>}
  {article.shoulder && <div><strong>Shoulder:</strong> {article.shoulder}</div>}
</div>
```

### 3.4 Article Filter / Search

Add a **Shoulder** filter input in the article search/filter section.

```tsx
<Input
  placeholder="Filter by shoulder..."
  value={filters.shoulder}
  onChange={(e) => setFilters({ ...filters, shoulder: e.target.value })}
/>
```

---

## 4. Field Reference

| Field | API Key | DB Column | Type | Nullable | Similar To |
|-------|---------|-----------|------|----------|------------|
| Hanger  | `hanger`  | `hanger`  | TEXT | Yes | — |
| Shoulder | `shoulder` | `shoulder` | TEXT | Yes | Hanger |

---

## 5. Migration Rollback (if needed)

If you need to undo the migration:

```bash
# Revert the last migration
npx typeorm migration:revert

# Or run the down method directly if needed
```

The `down` method in the migration will execute:
```sql
ALTER TABLE articles DROP COLUMN IF EXISTS "shoulder";
```

---

## 6. Summary of Changes on Backend

| File | Change |
|------|--------|
| `src/app/modules/article/entities/article.entity.ts` | Added `shoulder?: string` column |
| `src/app/modules/article/dtos/article/create.dto.ts` | Added `shoulder` to create DTO |
| `src/app/modules/article/dtos/article/update.dto.ts` | Added `shoulder` to update DTO |
| `src/app/modules/article/dtos/article/filter.dto.ts` | Added `shoulder` filter |
| `src/app/modules/article/services/article.service.ts` | Added `shoulder` ILIKE filter in both raw SQL & query builder |
| `src/database/migrations/AddShoulderToArticle.ts` | New migration to add the column |
