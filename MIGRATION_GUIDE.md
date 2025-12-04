# Database Migration Guide

## Quick Start

Run the migration script to automatically create all database tables:

```bash
npm run migrate
```

Or using the JavaScript version:

```bash
npm run migrate:js
```

## What It Does

The migration script will:
1. ✅ Connect to your Supabase database using `DIRECT_URL` from `.env.local`
2. ✅ Read the schema from `supabase/schema.sql`
3. ✅ Execute all SQL statements to create tables, indexes, and sample data
4. ✅ Verify that all tables were created successfully
5. ✅ Show you a summary of what was created

## Prerequisites

Make sure your `.env.local` file has:

```env
DIRECT_URL="postgresql://postgres.naxobbqeotjzrecvqwrt:demo@123@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

Or:

```env
DATABASE_URL="postgresql://postgres.naxobbqeotjzrecvqwrt:demo@123@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

## Expected Output

When successful, you should see:

```
📦 Starting database migration...
📖 Reading schema file...
✅ Schema file loaded
🔌 Connecting to database...
✅ Connected to database
🚀 Running migration...
✅ Migration completed successfully!

📊 Verifying tables...
✅ Tables created:
   - analytics_events
   - coffees
   - pairing_rules
   - pastries
   - sessions
   - shops

✅ Sample shop created:
   - Gloria Jeans (gloria-jeans-p88f)

🔌 Database connection closed

🎉 Migration complete! You can now start your dev server.
   Run: npm run dev
```

## Troubleshooting

### Error: "DATABASE_URL or DIRECT_URL not found"
- Make sure `.env.local` exists in the project root
- Verify `DIRECT_URL` or `DATABASE_URL` is set correctly

### Error: "Connection refused" or "ENOTFOUND"
- Check that your database URL is correct
- Verify your Supabase project is active (not paused)
- Check your network connection

### Error: "relation already exists"
- Tables already exist - this is okay!
- The script uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times

### Error: "permission denied"
- Check that your database password is correct
- Verify the database user has CREATE TABLE permissions

## Manual Migration (Alternative)

If the script doesn't work, you can run the migration manually:

1. Go to: https://supabase.com/dashboard/project/naxobbqeotjzrecvqwrt/editor
2. Click "SQL Editor" → "New query"
3. Copy all contents from `supabase/schema.sql`
4. Paste and click "Run"

## After Migration

Once the migration is complete:

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Test the application:**
   - Visit: http://localhost:3000/shop/gloria-jeans-p88f
   - Should work without errors!

3. **Add data via admin panel:**
   - Visit: http://localhost:3000/admin
   - Add coffees, pastries, and pairings

## Re-running Migrations

The migration script is **idempotent** - you can run it multiple times safely. It uses `CREATE TABLE IF NOT EXISTS` and `ON CONFLICT DO NOTHING`, so it won't break if tables already exist.

