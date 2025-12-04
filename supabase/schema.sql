-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Shops table
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  qr_code VARCHAR(255) UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coffees table
CREATE TABLE IF NOT EXISTS coffees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  roast VARCHAR(50),
  origin VARCHAR(255),
  tasting_notes TEXT[],
  description TEXT,
  image VARCHAR(500),
  price DECIMAL(10, 2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pastries table
CREATE TABLE IF NOT EXISTS pastries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  notes TEXT,
  flavor_profile TEXT,
  image VARCHAR(500),
  price DECIMAL(10, 2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pairing rules table
CREATE TABLE IF NOT EXISTS pairing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  coffee_id UUID REFERENCES coffees(id) ON DELETE CASCADE,
  pastry_id UUID REFERENCES pastries(id) ON DELETE CASCADE,
  match_score INTEGER CHECK (match_score >= 1 AND match_score <= 100),
  reasoning TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, coffee_id, pastry_id)
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  session_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- scan, coffee_select, pairing_view, pairing_accept, add_to_cart, checkout
  coffee_id UUID REFERENCES coffees(id) ON DELETE SET NULL,
  pastry_id UUID REFERENCES pastries(id) ON DELETE SET NULL,
  pairing_rule_id UUID REFERENCES pairing_rules(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table for tracking user sessions
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_coffees_shop_id ON coffees(shop_id);
CREATE INDEX IF NOT EXISTS idx_pastries_shop_id ON pastries(shop_id);
CREATE INDEX IF NOT EXISTS idx_pairing_rules_shop_id ON pairing_rules(shop_id);
CREATE INDEX IF NOT EXISTS idx_pairing_rules_coffee_id ON pairing_rules(coffee_id);
CREATE INDEX IF NOT EXISTS idx_pairing_rules_pastry_id ON pairing_rules(pastry_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_shop_id ON analytics_events(shop_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Insert sample shop (Gloria Jeans)
INSERT INTO shops (id, name, slug, qr_code) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Gloria Jeans', 'gloria-jeans-p88f', 'gloria-jeans-p88f')
ON CONFLICT (slug) DO NOTHING;

