# Test Credentials

## Current Status

**No default credentials exist** - You need to create accounts first.

## Option 1: Create Test Admin Account (Recommended)

### Using the Script

1. **Get your Supabase Service Role Key:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the `service_role` key (keep this secret!)
   - Add it to `.env.local`:
     ```env
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
     ```

2. **Run the script:**
   ```bash
   npm run create:test-user
   # or
   yarn create:test-user
   ```

3. **Default Admin Credentials:**
   - **Email:** `admin@coffeeshop.demo`
   - **Password:** `Admin123!@#`
   - **Access:** Admin panel at `/admin`

### Login
- Visit: http://localhost:3000/auth/login
- Enter the credentials above
- You'll be redirected to `/admin` after login

## Option 2: Manual Signup

### Create Admin Account via Signup Page

1. Visit: http://localhost:3000/auth/signup
2. Fill in the form:
   - **Name:** Your name
   - **Email:** Your email (e.g., `admin@yourcafe.com`)
   - **Password:** At least 8 characters with a number
   - **Café Name:** Your shop name
3. Click "Create shop"
4. You'll be redirected to login
5. Log in with your credentials

### Create Regular User Account

Regular users (customers) don't need accounts - they can browse shops directly:
- Visit: http://localhost:3000/shop/gloria-jeans-p88f
- No login required for shopping

## Option 3: Create via Supabase Dashboard

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password
4. Set email as confirmed
5. Use these credentials to log in

## User Roles

### Admin User
- **Access:** `/admin` and all admin pages
- **Can:** Manage coffees, pastries, pairings, view analytics
- **Requires:** Authentication (login required)

### Regular User (Customer)
- **Access:** Shop pages, cart, checkout
- **Can:** Browse menu, select coffees, view pairings, add to cart
- **Requires:** No authentication (public access)

## Security Notes

⚠️ **Important:**
- The test admin credentials are for **development only**
- Never use these in production
- Change passwords after first login in production
- The service role key has full database access - keep it secret!

## Troubleshooting

### "Cannot create user" error
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Check that your Supabase project is active (not paused)
- Verify the service role key is correct

### "User already exists"
- The script will show existing credentials if the user already exists
- You can use those credentials to log in
- Or delete the user in Supabase Dashboard and run the script again

### "Unauthorized" when accessing admin
- Make sure you're logged in
- Visit `/auth/login` first
- Check that your account email is confirmed in Supabase

