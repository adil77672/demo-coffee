# Drizzle Kit Migration Guide

Drizzle Kit is now set up for database migrations and schema management.

## Quick Commands

### Generate Migration
Create a new migration from schema changes:
```bash
npm run db:generate
```

### Push Schema (Development)
Push schema changes directly to database (no migration files):
```bash
npm run db:push
```

### Run Migrations
Apply pending migrations:
```bash
npm run db:migrate
```

### Open Drizzle Studio
Visual database browser and editor:
```bash
npm run db:studio
```

## Workflow

### Initial Setup (First Time)

Since you already have a SQL schema, you have two options:

**Option 1: Use existing SQL migration script**
```bash
npm run migrate
```
This uses the existing `supabase/schema.sql` file.

**Option 2: Use Drizzle to push schema**
```bash
npm run db:push
```
This will create tables based on `lib/db/schema.ts`.

### Making Schema Changes

1. **Edit the schema** in `lib/db/schema.ts`

2. **Generate migration:**
   ```bash
   npm run db:generate
   ```
   This creates migration files in the `drizzle/` directory.

3. **Apply migration:**
   ```bash
   npm run db:migrate
   ```

   Or for development, push directly:
   ```bash
   npm run db:push
   ```

## Schema Files

- **`lib/db/schema.ts`** - Drizzle schema definitions
- **`lib/db/index.ts`** - Database connection and exports
- **`drizzle.config.ts`** - Drizzle Kit configuration
- **`supabase/schema.sql`** - Original SQL schema (still available)

## Using Drizzle in Your Code

Instead of using Supabase client directly, you can use Drizzle:

```typescript
import { db, shops, coffees } from '@/lib/db'

// Query shops
const allShops = await db.select().from(shops)

// Insert a shop
await db.insert(shops).values({
  name: 'New Shop',
  slug: 'new-shop',
  qrCode: 'new-shop-qr',
})

// Query with relations
const shopsWithCoffees = await db
  .select()
  .from(shops)
  .leftJoin(coffees, eq(shops.id, coffees.shopId))
```

## Drizzle Studio

Drizzle Studio provides a visual interface to browse and edit your database:

```bash
npm run db:studio
```

This opens a web interface at http://localhost:4983 where you can:
- Browse tables
- View data
- Edit records
- Run queries

## Migration Files

When you run `npm run db:generate`, Drizzle creates migration files in:
```
drizzle/
  └── migrations/
      └── [timestamp]_[name].sql
```

These files are version-controlled and can be applied to any environment.

## Configuration

Drizzle is configured in `drizzle.config.ts`:
- Uses `DIRECT_URL` or `DATABASE_URL` from `.env.local`
- Schema file: `lib/db/schema.ts`
- Output directory: `drizzle/`
- Dialect: PostgreSQL

## Notes

- Drizzle schema is in TypeScript, providing type safety
- The original SQL schema (`supabase/schema.sql`) is still available
- You can use both Drizzle and Supabase client in the same project
- Drizzle is great for migrations, Supabase client for real-time features

