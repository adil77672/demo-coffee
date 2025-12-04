# How to Get Your Supabase Anon Key

Since the database connection string doesn't contain the anon key, you need to get it from the Supabase dashboard.

## Quick Steps:

1. **Go to your Supabase project dashboard:**
   ```
   https://supabase.com/dashboard/project/naxobbqeotjzrecvqwrt/settings/api
   ```

2. **Find the "API Keys" section**

3. **Copy the "anon public" key** (it's a long JWT token starting with `eyJ...`)

4. **Paste it into `.env.local`** replacing `your_anon_key_here`

## Alternative: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase projects list
supabase projects api-keys --project-ref naxobbqeotjzrecvqwrt
```

But the easiest way is through the dashboard link above.

