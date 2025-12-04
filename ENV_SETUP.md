# Environment Variables Setup

## Quick Setup

You need to create a `.env.local` file in the project root with your Supabase credentials.

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. You'll find two values you need:

### Required Values:

1. **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - Format: `https://[project-ref].supabase.co`
   - Example: `https://naxobbqeotjzrecvqwrt.supabase.co`

2. **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - This is a long JWT token starting with `eyJ...`
   - It's safe to use in client-side code (it's public)

## Step 2: Create .env.local File

Create a file named `.env.local` in the project root directory:

```bash
# In the project root
touch .env.local
```

## Step 3: Add Your Credentials

Open `.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:**
- Replace `your-project-ref` with your actual project reference
- Replace `your-anon-key-here` with your actual anon key
- Do NOT add quotes around the values
- Do NOT commit this file to git (it's already in .gitignore)

## Step 4: Restart Development Server

After creating/updating `.env.local`:

1. Stop your dev server (Ctrl+C)
2. Start it again: `npm run dev`

## Example .env.local

Based on your database connection, your project reference appears to be `naxobbqeotjzrecvqwrt`, so your URL might be:

```env
NEXT_PUBLIC_SUPABASE_URL=https://naxobbqeotjzrecvqwrt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**But you still need to get the actual anon key from your Supabase dashboard!**

## Where to Find These Values

### Option 1: Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Option 2: From Database URL
If you have a database URL like:
```
postgresql://postgres.naxobbqeotjzrecvqwrt:password@...
```

Then your project reference is `naxobbqeotjzrecvqwrt`, so:
- URL would be: `https://naxobbqeotjzrecvqwrt.supabase.co`
- But you still need the anon key from the dashboard!

## Verification

After setting up, you should be able to:
1. Run `npm run dev` without errors
2. Visit http://localhost:3000
3. See the application load (even if there's no data yet)

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure `.env.local` exists in the project root
- Check that variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Ensure there are no extra spaces or quotes
- Restart the dev server after creating/editing `.env.local`

### Error: "Invalid API key"
- Double-check you copied the **anon/public** key (not the service_role key)
- Make sure there are no extra characters or line breaks
- The key should start with `eyJ`

### Still having issues?
1. Verify your Supabase project is active
2. Check that you're using the correct project
3. Make sure the anon key hasn't been rotated
4. Try regenerating the anon key in Supabase dashboard

