# Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Database

1. Go to https://supabase.com and create a new project
2. Wait for the project to be ready (takes ~2 minutes)
3. Go to **SQL Editor** in the Supabase dashboard
4. Copy and paste the entire contents of `supabase/schema.sql`
5. Click **Run** to execute the schema

### 3. Get Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 4. Configure Environment Variables

Create a file named `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the placeholders with your actual values from step 3.

### 5. Run the Application

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Testing the Application

### Test User Flow

1. Visit: http://localhost:3000/shop/gloria-jeans-p88f
2. You should see the shop page (may be empty if no coffees added)
3. Visit: http://localhost:3000/admin to access the admin panel

### Add Sample Data via Admin Panel

1. Go to `/admin/coffees` and add a coffee
2. Go to `/admin/pastries` and add a pastry
3. Go to `/admin/pairings` and create a pairing rule
4. Return to the shop page to see your data

### Test QR Code Flow

1. Visit: http://localhost:3000/qr/gloria-jeans-p88f
2. This should redirect to the shop page and track a scan event

## Troubleshooting

### "Invalid API key" error
- Check that your `.env.local` file has the correct values
- Make sure there are no extra spaces or quotes
- Restart the dev server after changing `.env.local`

### "Table does not exist" error
- Make sure you ran the SQL schema in Supabase SQL Editor
- Check that all tables were created successfully

### Images not loading
- Make sure image URLs are valid and accessible
- Check browser console for CORS errors
- The Next.js config allows all external images

## Next Steps

1. Add your first shop via SQL or admin panel
2. Add coffees and pastries
3. Create pairing rules
4. Test the full user flow
5. Check analytics at `/admin/analytics`

## Database Schema Overview

The schema includes:
- **shops**: Shop information with QR codes
- **coffees**: Coffee menu items
- **pastries**: Pastry menu items
- **pairing_rules**: Coffee-pastry pairing rules with match scores
- **analytics_events**: Event tracking for user behavior
- **sessions**: Session tracking

All tables are created automatically when you run the schema SQL.

