# Database Setup - Create Tables

## Current Status

✅ **Connection working!** The Supabase client is connected successfully.  
❌ **Tables missing** - You need to create the database tables.

## Error You're Seeing

```
Could not find the table 'public.shops' in the schema cache
```

This means the database schema hasn't been run yet.

## Solution: Run the SQL Schema

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase dashboard:
   - https://supabase.com/dashboard/project/naxobbqeotjzrecvqwrt
   
2. Click on **"SQL Editor"** in the left sidebar

3. Click **"New query"**

### Step 2: Copy and Paste the Schema

1. Open the file: `supabase/schema.sql` in this project
2. Copy **ALL** the contents
3. Paste into the SQL Editor in Supabase

### Step 3: Run the Schema

1. Click the **"Run"** button (or press Cmd/Ctrl + Enter)
2. Wait for it to complete
3. You should see "Success. No rows returned"

### Step 4: Verify Tables Were Created

In the SQL Editor, run this query to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

You should see:
- shops
- coffees
- pastries
- pairing_rules
- analytics_events
- sessions

## After Running the Schema

1. **Restart your dev server** (if it's running):
   ```bash
   # Stop with Ctrl+C, then:
   yarn dev
   ```

2. **Test the application**:
   - Visit: http://localhost:3000/shop/gloria-jeans-p88f
   - Should now work without errors!

3. **Add data via admin panel**:
   - Visit: http://localhost:3000/admin
   - Add coffees, pastries, and pairings

## Quick Copy-Paste Schema

The schema file is at: `supabase/schema.sql`

Just copy the entire file and paste it into Supabase SQL Editor, then click Run!

