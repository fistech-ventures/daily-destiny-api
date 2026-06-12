# Area-wise News Feature - Implementation Guide

## ✅ Feature Status: COMPLETE

This document describes the complete "Area-wise News" feature implementation for the entrepreneurnews-api backend.

---

## 📋 Overview

The Area-wise News feature enables users to:
- Filter news by geographic location (Bangladesh administrative hierarchy)
- Assign multiple locations to articles with a primary location flag
- Navigate the location hierarchy through cascading dropdowns
- Seed Bangladesh location data in bulk

**Geographic Hierarchy**: Division → District → Upazilla → Union/City Corporation/Pourosova

---

## 🎯 Implementation Summary

### New Modules & Entities

#### 1. **Location Entity** (`src/app/modules/location/entities/location.entity.ts`)
- **UUID primary key**
- **Nested-set tree structure** for efficient hierarchy queries
- **Fields:**
  - `name` (English) - Required
  - `nameBn` (Bengali) - Optional
  - `slug` (unique, auto-indexed) - Required
  - `type` (enum: division|district|upazilla|union|city_corporation|pourosova) - Required
  - `parentId` (self-referencing FK) - Nullable
  - `position` (for ordering)
  - `isActive` (soft delete support)
  - Standard `createdAt`, `updatedAt` timestamps

#### 2. **ArticleLocation Junction Entity** (`src/app/modules/location/entities/articleLocation.entity.ts`)
- **Composite primary key:** `(articleId, locationId)`
- **isPrimary flag** - Mark one location as primary per article
- **Many-to-many relationship** between Article ↔ Location

#### 3. **Location Module** (`src/app/modules/location/location.module.ts`)
- Exports `LocationService` for use across the app
- Registers both internal and web controllers
- Provides all CRUD and hierarchy operations

---

## 📡 API Endpoints

### **Admin/Internal Endpoints** (Protected - Auth Required)
All endpoints require valid JWT authentication.

#### Create Location
```http
POST /internal/locations
Content-Type: application/json

{
  "name": "Dhaka",
  "nameBn": "ঢাকা",
  "slug": "dhaka",
  "type": "division",
  "parentId": null,
  "position": 1
}
```

**Validation Rules:**
- Slug must be unique
- Type hierarchy must match parent type (see hierarchy rules below)
- Division cannot have a parent
- Other types must have a parent of the correct type

#### Get All Locations (with Filters)
```http
GET /internal/locations?type=division&parentId=uuid&isActive=true&searchTerm=dhaka&page=1&limit=10
```

**Query Parameters:**
- `type` - Filter by location type (division|district|upazilla|union|city_corporation|pourosova)
- `parentId` - Filter by parent location
- `isActive` - Filter active/inactive locations (default: true)
- `searchTerm` - Search by name or nameBn
- `page` - Pagination (default: 1)
- `limit` - Items per page (default: 10)

#### Get Location with Children
```http
GET /internal/locations/:id
```

**Response includes:**
- The location details
- All direct children
- Parent information

#### Update Location
```http
PATCH /internal/locations/:id
Content-Type: application/json

{
  "name": "Dhaka Updated",
  "position": 2
}
```

**Notes:**
- Prevents circular references (location cannot be its own parent)
- Validates hierarchy changes
- Soft updates only (no physical deletion)

#### Delete Location (Soft Delete)
```http
DELETE /internal/locations/:id
```

Sets `isActive = false` instead of hard deletion.

#### Bulk Seed Locations
```http
POST /internal/locations/seed
Content-Type: application/json

{
  "locations": [
    {
      "name": "Dhaka",
      "nameBn": "ঢাকা",
      "slug": "dhaka",
      "type": "division",
      "parentSlug": null,
      "position": 1
    },
    {
      "name": "Narsingdi",
      "nameBn": "নরসিংদী",
      "slug": "narsingdi",
      "type": "district",
      "parentSlug": "dhaka",
      "position": 2
    }
  ]
}
```

**Features:**
- **Idempotent** - Skips duplicates based on slug
- **Parent resolution** - Uses `parentSlug` instead of UUID for seed data
- **Batch insert** - Efficiently handles large datasets
- **Returns summary:**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Locations seeded successfully",
    "data": {
      "inserted": 25,
      "skipped": 5,
      "errors": []
    }
  }
  ```

---

### **Public Endpoints** (No Auth Required)

#### Get Location Children (Cascading Dropdown)
```http
GET /web/locations/children/:parentId
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Dhaka District",
      "nameBn": "ঢাকা জেলা",
      "slug": "dhaka-district",
      "type": "district",
      "position": 1,
      "isActive": true
    }
  ]
}
```

Used for building cascading dropdowns in the frontend.

#### Get Full Location Tree
```http
GET /web/locations/tree
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Dhaka",
      "slug": "dhaka",
      "type": "division",
      "children": [
        {
          "name": "Dhaka District",
          "slug": "dhaka-district",
          "type": "district",
          "children": [
            {
              "name": "Dhaka Sadar",
              "slug": "dhaka-sadar",
              "type": "upazilla",
              "children": [...]
            }
          ]
        }
      ]
    }
  ]
}
```

Returns fully nested tree structure starting from division level. **Cacheable** - Location tree rarely changes.

---

## 🔗 Article Integration

### **Updated Article Entity**
Now includes a `locations` relationship:
```typescript
@OneToMany(() => ArticleLocation, (e) => e.article)
locations?: ArticleLocation[];
```

### **Create Article with Locations**
```http
POST /internal/articles
Content-Type: application/json

{
  "title": "Breaking News from Dhaka",
  "slug": "breaking-news-from-dhaka",
  "type": "news",
  "categoryId": "uuid",
  "authorId": "uuid",
  "details": "Article content...",
  "coverImage": "https://...",
  "coverImageCredit": "...",
  "date": "2025-06-12",
  "language": "en",
  "status": "published",
  "locations": [
    {
      "locationId": "dhaka-uuid",
      "isPrimary": true
    },
    {
      "locationId": "dhaka-district-uuid",
      "isPrimary": false
    }
  ]
}
```

**Notes:**
- `locations` is an optional array
- Each location has a `locationId` (UUID) and optional `isPrimary` flag
- Only one location per article should have `isPrimary: true`
- Multiple locations per article supported

### **Update Article Locations**
```http
PATCH /internal/articles/:id
Content-Type: application/json

{
  "locations": [
    {
      "locationId": "new-location-uuid",
      "isPrimary": true
    }
  ]
}
```

Updates article location assignments (replaces all existing).

---

## 🔍 Filter Articles by Location

### **New Filter Query Parameters**

```http
GET /web/articles
```

**Location filters (use only one):**
- `divisionId=uuid` - Returns articles from this division AND all its descendants (districts, upazillas, unions)
- `districtId=uuid` - Returns articles from this district AND all its descendants (upazillas, unions)
- `upazillaId=uuid` - Returns articles from this upazilla AND all its descendants (unions)
- `unionId=uuid` - Returns articles from this specific union only
- `locationId=uuid` - Returns articles from this exact location only

**Can combine with existing filters:**
```http
GET /web/articles?divisionId=dhaka-uuid&categoryId=tech-uuid&language=en&page=1&limit=20
```

Returns articles tagged to Dhaka division (or any descendant) + Tech category + English language.

### **Example Queries**

```bash
# All news from Dhaka division
curl "https://api.example.com/web/articles?divisionId=dhaka-uuid"

# All news from Narayanganj district
curl "https://api.example.com/web/articles?districtId=narayanganj-uuid"

# Tech news from Dhaka Sadar upazilla
curl "https://api.example.com/web/articles?upazillaId=dhaka-sadar-uuid&categoryId=tech-uuid"

# News from Motijheel union only
curl "https://api.example.com/web/articles?unionId=motijheel-uuid"
```

---

## 🌳 Location Type Hierarchy Validation

The system enforces strict parent-child type relationships:

| Type | Parent Type | Parent Required |
|------|------------|-----------------|
| `division` | None | ❌ No |
| `district` | `division` | ✅ Yes |
| `upazilla` | `district` | ✅ Yes |
| `union` | `upazilla` | ✅ Yes |
| `city_corporation` | `upazilla` | ✅ Yes |
| `pourosova` | `upazilla` | ✅ Yes |

**Validation:**
- Attempting to create/update a location with invalid parent type returns `400 Bad Request`
- Circular references are prevented (location cannot be its own parent)
- Changing a location's type requires compatible parent

---

## 📦 Sample Seed Data

A sample Bangladesh location dataset is included at:
```
src/app/modules/location/seed-data/bangladesh-locations.json
```

**To seed locations:**

1. Read the seed data file
2. POST to `/internal/locations/seed` with the location array
3. System automatically handles parent resolution via slug references

**Sample seed curl:**
```bash
curl -X POST "https://api.example.com/internal/locations/seed" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @bangladesh-locations.json
```

---

## 🛠️ Database Schema

### `locations` table
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(250) NOT NULL,
  nameBn VARCHAR(250),
  slug VARCHAR UNIQUE NOT NULL,
  type ENUM('division', 'district', 'upazilla', 'union', 'city_corporation', 'pourosova') NOT NULL,
  parentId UUID REFERENCES locations(id) ON DELETE CASCADE,
  position INT DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  createdBy JSONB,
  updatedBy JSONB,
  -- Nested-set tree columns for efficient hierarchy queries
  nsleft INT,
  nsright INT,
  nslevel INT
);

CREATE INDEX idx_locations_slug ON locations(slug);
CREATE INDEX idx_locations_type ON locations(type);
CREATE INDEX idx_locations_parentId ON locations(parentId);
CREATE INDEX idx_locations_isActive ON locations(isActive);
```

### `article_locations` junction table
```sql
CREATE TABLE article_locations (
  articleId UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  locationId UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  isPrimary BOOLEAN DEFAULT false,
  createdAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (articleId, locationId)
);

CREATE INDEX idx_article_locations_articleId ON article_locations(articleId);
CREATE INDEX idx_article_locations_locationId ON article_locations(locationId);
CREATE INDEX idx_article_locations_isPrimary ON article_locations(isPrimary);
```

---

## 🚀 Usage Example: Complete Workflow

### 1. **Initialize Location Data**
```bash
# Admin seeds Bangladesh location hierarchy
curl -X POST "https://api.example.com/internal/locations/seed" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "locations": [
      {
        "name": "Dhaka",
        "nameBn": "ঢাকা",
        "slug": "dhaka",
        "type": "division"
      },
      {
        "name": "Dhaka District",
        "nameBn": "ঢাকা জেলা",
        "slug": "dhaka-district",
        "type": "district",
        "parentSlug": "dhaka"
      }
    ]
  }'
```

### 2. **Create News Article with Location**
```bash
curl -X POST "https://api.example.com/internal/articles" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dhaka Metro Expansion Plan",
    "slug": "dhaka-metro-expansion",
    "type": "news",
    "categoryId": "infrastructure-uuid",
    "authorId": "journalist-uuid",
    "details": "...",
    "coverImage": "...",
    "date": "2025-06-12",
    "language": "en",
    "status": "published",
    "locations": [
      {
        "locationId": "dhaka-uuid",
        "isPrimary": true
      }
    ]
  }'
```

### 3. **Frontend: Get Location Tree for Dropdown**
```bash
# Public endpoint, no auth needed
curl "https://api.example.com/web/locations/tree"
```

### 4. **Frontend: Get District Options when Division Selected**
```bash
curl "https://api.example.com/web/locations/children/dhaka-division-uuid"
```

### 5. **Frontend: Filter Articles by Location**
```bash
# Show all news from Dhaka division
curl "https://api.example.com/web/articles?divisionId=dhaka-uuid&limit=20"
```

---

## 📝 Response Format

All endpoints follow the consistent response format:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": { /* actual data */ },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "skip": 0
  }
}
```

---

## 🔐 Authentication & Authorization

- **Public endpoints** (`/web/locations/*`): No authentication required
- **Admin endpoints** (`/internal/locations/*`): Requires valid JWT token
- **Article endpoints** 
  - GET `/web/articles`: Public
  - POST/PATCH `/internal/articles`: Admin only

---

## 📚 Swagger Documentation

All endpoints are documented with:
- Request/response schemas
- Query parameter descriptions
- Authentication requirements
- Example requests and responses

Access Swagger UI at: `https://api.example.com/api/docs`

---

## ⚠️ Important Notes

1. **Circular References**: The system prevents a location from becoming its own parent
2. **Soft Deletes**: Delete operations set `isActive = false`, allowing recovery
3. **Slug Uniqueness**: Slugs are globally unique across all location types
4. **Tree Queries**: Use the nested-set tree structure for efficient hierarchy traversals
5. **Primary Location**: Only one location per article should have `isPrimary: true`

---

## 🧪 Testing

### Test Location Hierarchy Validation
```bash
# This should fail - district cannot have division as parent
curl -X POST "https://api.example.com/internal/locations" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "Invalid District",
    "slug": "invalid-district",
    "type": "district",
    "parentId": "another-district-uuid"
  }'
# Expected: 400 Bad Request - "Parent of district must be division..."
```

### Test Location Filtering
```bash
# Create test articles with different locations
# Then filter by location and verify correct articles returned

curl "https://api.example.com/web/articles?divisionId=test-division-uuid"
# Should return articles tagged to that division and its descendants
```

---

## 📖 Code Organization

```
src/app/modules/location/
├── entities/
│   ├── location.entity.ts           # Location model
│   ├── articleLocation.entity.ts    # Junction table
│   └── index.ts
├── dtos/
│   ├── location.create.dto.ts
│   ├── location.update.dto.ts
│   ├── location.filter.dto.ts
│   ├── location.seed.dto.ts
│   └── index.ts
├── services/
│   └── location.service.ts          # Business logic
├── controllers/
│   ├── location.internal.controller.ts  # Admin routes
│   └── location.web.controller.ts       # Public routes
├── const/
│   └── index.ts                     # Type hierarchy rules
├── seed-data/
│   └── bangladesh-locations.json    # Sample data
└── location.module.ts               # Module definition
```

---

## 🎓 Next Steps

1. **Run database migrations** (if using TypeORM migrations)
2. **Seed location data** using the provided Bangladesh location dataset
3. **Test location filtering** with sample articles
4. **Implement frontend** to use the cascading dropdown endpoints
5. **Monitor performance** - Nested-set tree should handle hierarchy queries efficiently

---

## ❓ FAQ

**Q: Can I delete a location with articles assigned?**
A: Yes, you can soft-delete (set isActive=false). The articles will retain their location assignments but the location won't appear in active queries.

**Q: How do I change a location's type?**
A: Update the location with a new type. The system validates that the parent type matches the new type's expected parent.

**Q: Can an article have no location?**
A: Yes, the `locations` field is optional when creating/updating articles.

**Q: What if I want to add a new location type?**
A: Update the `ENUM_LOCATION_TYPE` enum and the `LOCATION_TYPE_HIERARCHY` constant, then define the parent type mapping.

---

## 📞 Support

For issues or questions, refer to:
1. This implementation guide
2. API Swagger documentation
3. TypeORM documentation for database queries
4. NestJS documentation for framework-specific questions
