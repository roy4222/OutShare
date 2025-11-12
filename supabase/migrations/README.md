# Database Migrations

This directory contains SQL migrations for the Supabase database.

## Migration Files

### 20251107_add_categories_table.sql
- **Purpose**: Adds the `categories` table for user-defined gear categorization
- **Dependencies**: Requires `profiles` table to exist (for FK constraint)
- **Safe to re-run**: Yes (uses `CREATE TABLE IF NOT EXISTS`)

## Running Migrations

### Local Development (Supabase CLI)

```bash
# Apply all pending migrations
pnpm supabase db push

# Or manually execute a specific migration
pnpm supabase db execute -f supabase/migrations/20251107_add_categories_table.sql
```

### Production (Supabase Dashboard)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the migration file content
4. Execute the SQL

### Using Drizzle Kit

The Drizzle migration is located at `drizzle/0001_add_categories.sql`:

```bash
# Push schema changes to database
pnpm db:push

# Or generate new migrations from schema changes
pnpm db:generate
```

## Migration Order

If setting up a new database from scratch:

1. Initial schema (profiles, gear, trip, trip_gear) - should already exist from Prisma/initial setup
2. `20251107_add_categories_table.sql` - adds categories table

## Rollback

To remove the categories table:

```sql
-- Drop the categories table (will cascade delete all category records)
DROP TABLE IF EXISTS public.categories CASCADE;
```

**Warning**: This will permanently delete all user-created categories.
