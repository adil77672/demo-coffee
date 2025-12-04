# Coffee Pairing MVP

A full-stack Next.js application for coffee shop pairing experiences with QR code entry, admin panel, and analytics.

## Features

- **Shop-specific QR routing**: Each shop has a unique QR code that routes to their menu
- **Coffee → Pastry pairing flow**: Select a coffee and get AI-powered pastry pairing suggestions
- **Shopping cart**: Add pairings to cart and proceed through simulated checkout
- **Admin panel**: Full CRUD for coffees, pastries, and pairing rules
- **Analytics dashboard**: Track scans, pairings, accept rates, and conversions
- **Supabase backend**: PostgreSQL database with real-time capabilities

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Analytics**: Event-based tracking system

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Get your Supabase URL and anon key from Project Settings > API

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Database Migration

Execute the SQL schema in `supabase/schema.sql` in your Supabase SQL Editor. This will create:
- `shops` table
- `coffees` table
- `pastries` table
- `pairing_rules` table
- `analytics_events` table
- `sessions` table

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
demo/
├── app/
│   ├── admin/              # Admin panel routes
│   │   ├── coffees/        # Coffee management
│   │   ├── pastries/       # Pastry management
│   │   ├── pairings/       # Pairing rules management
│   │   └── analytics/      # Analytics dashboard
│   ├── shop/               # Shop pages
│   │   └── [slug]/         # Shop-specific pages
│   │       ├── coffee/     # Coffee selection
│   │       ├── cart/       # Shopping cart
│   │       └── checkout/  # Checkout flow
│   └── qr/                 # QR code routing
│       └── [code]/         # QR code handler
├── components/
│   ├── admin/              # Admin components
│   ├── CoffeeSelection.tsx
│   ├── PairingView.tsx
│   ├── CartView.tsx
│   └── ScanTracker.tsx
├── lib/
│   ├── supabase/           # Supabase client utilities
│   ├── analytics.ts        # Analytics tracking
│   ├── pairing.ts          # Pairing engine
│   ├── shop.ts             # Shop utilities
│   └── types.ts            # TypeScript types
└── supabase/
    └── schema.sql          # Database schema
```

## Usage

### User Flow

1. **QR Code Scan**: User scans shop-specific QR code → `/qr/[code]`
2. **Shop Page**: Redirects to shop page → `/shop/[slug]`
3. **Coffee Selection**: User selects a coffee → `/shop/[slug]/coffee/[coffeeId]`
4. **Pairing View**: System shows pastry pairings with match scores
5. **Add to Cart**: User accepts a pairing → `/shop/[slug]/cart`
6. **Checkout**: User proceeds to checkout → `/shop/[slug]/checkout/success`

### Admin Panel

Access the admin panel at `/admin`:

- **Coffees**: Add, edit, delete coffee items
- **Pastries**: Add, edit, delete pastry items
- **Pairings**: Create and manage coffee-pastry pairing rules
- **Analytics**: View real-time analytics dashboard

### Analytics Events

The system tracks the following events:
- `scan`: User scans QR code
- `coffee_select`: User selects a coffee
- `pairing_view`: User views pairing suggestions
- `pairing_accept`: User accepts a pairing
- `add_to_cart`: User adds items to cart
- `checkout`: User completes checkout

## Database Schema

### Shops
- id, name, slug, qr_code, settings

### Coffees
- id, shop_id, name, roast, origin, tasting_notes, description, image, price, active

### Pastries
- id, shop_id, name, notes, flavor_profile, image, price, active

### Pairing Rules
- id, shop_id, coffee_id, pastry_id, match_score (1-100), reasoning, active

### Analytics Events
- id, shop_id, session_id, event_type, coffee_id, pastry_id, pairing_rule_id, metadata

## Sample Data

The schema includes a sample shop "Gloria Jeans" with slug `gloria-jeans-p88f` and QR code `gloria-jeans-p88f`.

## Development

### Adding a New Shop

1. Insert into `shops` table with unique `slug` and `qr_code`
2. Add coffees and pastries for that shop
3. Create pairing rules linking coffees to pastries

### Creating Pairings

Pairings are rule-based with match scores (1-100). Higher scores appear first in the pairing suggestions.

## Production Deployment

1. Set up environment variables in your hosting platform
2. Run database migrations
3. Build and deploy:

```bash
npm run build
npm start
```

## License

Private project - All rights reserved
# demo-coffee
# demo-coffee
# demo-coffee
