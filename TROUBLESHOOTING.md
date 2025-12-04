# Troubleshooting: DNS/Connection Issues

## Error: `ENOTFOUND naxobbqeotjzrecvqwrt.supabase.co`

This error means the Supabase URL cannot be resolved. Here's how to fix it:

## Step 1: Verify Your Supabase Project URL

The URL in your `.env.local` might be incorrect. To get the correct URL:

1. **Go to your Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Select your project

2. **Navigate to Settings → API:**
   - Click the gear icon (Settings)
   - Click "API" in the sidebar

3. **Copy the exact "Project URL":**
   - It should look like: `https://xxxxx.supabase.co`
   - Copy it exactly as shown

4. **Update `.env.local`:**
   - Replace `NEXT_PUBLIC_SUPABASE_URL` with the exact URL from the dashboard

## Step 2: Check Project Status

Make sure your Supabase project is:
- ✅ Active (not paused)
- ✅ Fully provisioned
- ✅ Accessible

If the project is paused, you'll need to resume it in the dashboard.

## Step 3: Verify Network Connection

Test if you can reach Supabase:

```bash
curl -I https://naxobbqeotjzrecvqwrt.supabase.co
```

If this fails, the project might not exist or the URL is wrong.

## Step 4: Alternative URL Formats

Sometimes Supabase projects use different URL formats:
- `https://[project-ref].supabase.co` (standard)
- `https://[project-ref].supabase.io` (older format)
- Custom domains

Check your dashboard for the exact format.

## Quick Fix

1. Open: https://supabase.com/dashboard/project/_/settings/api
2. Copy the "Project URL" exactly
3. Update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=<paste-exact-url-here>
   ```
4. Restart dev server: `npm run dev`

## Still Having Issues?

- Verify the project exists and is active
- Check if you have the correct project selected
- Try accessing the Supabase dashboard to confirm the project is accessible
- Contact Supabase support if the project seems to be missing

