import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, jsonb, index, unique } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// Shops table
export const shops = pgTable('shops', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  qrCode: varchar('qr_code', { length: 255 }).notNull().unique(),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('idx_shops_slug').on(table.slug),
}))

// Coffees table
export const coffees = pgTable('coffees', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  shopId: uuid('shop_id').notNull().references(() => shops.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  roast: varchar('roast', { length: 50 }),
  origin: varchar('origin', { length: 255 }),
  tastingNotes: text('tasting_notes').array(),
  description: text('description'),
  image: varchar('image', { length: 500 }),
  price: decimal('price', { precision: 10, scale: 2 }),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  shopIdIdx: index('idx_coffees_shop_id').on(table.shopId),
}))

// Pastries table
export const pastries = pgTable('pastries', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  shopId: uuid('shop_id').notNull().references(() => shops.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  notes: text('notes'),
  flavorProfile: text('flavor_profile'),
  image: varchar('image', { length: 500 }),
  price: decimal('price', { precision: 10, scale: 2 }),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  shopIdIdx: index('idx_pastries_shop_id').on(table.shopId),
}))

// Pairing rules table
export const pairingRules = pgTable('pairing_rules', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  shopId: uuid('shop_id').notNull().references(() => shops.id, { onDelete: 'cascade' }),
  coffeeId: uuid('coffee_id').notNull().references(() => coffees.id, { onDelete: 'cascade' }),
  pastryId: uuid('pastry_id').notNull().references(() => pastries.id, { onDelete: 'cascade' }),
  matchScore: integer('match_score').notNull(), // 1-100
  reasoning: text('reasoning'),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  shopIdIdx: index('idx_pairing_rules_shop_id').on(table.shopId),
  coffeeIdIdx: index('idx_pairing_rules_coffee_id').on(table.coffeeId),
  pastryIdIdx: index('idx_pairing_rules_pastry_id').on(table.pastryId),
  uniquePairing: unique().on(table.shopId, table.coffeeId, table.pastryId),
}))

// Analytics events table
export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  shopId: uuid('shop_id').notNull().references(() => shops.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(), // scan, coffee_select, pairing_view, pairing_accept, add_to_cart, checkout
  coffeeId: uuid('coffee_id').references(() => coffees.id, { onDelete: 'set null' }),
  pastryId: uuid('pastry_id').references(() => pastries.id, { onDelete: 'set null' }),
  pairingRuleId: uuid('pairing_rule_id').references(() => pairingRules.id, { onDelete: 'set null' }),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  shopIdIdx: index('idx_analytics_events_shop_id').on(table.shopId),
  sessionIdIdx: index('idx_analytics_events_session_id').on(table.sessionId),
  eventTypeIdx: index('idx_analytics_events_event_type').on(table.eventType),
  createdAtIdx: index('idx_analytics_events_created_at').on(table.createdAt),
}))

// Sessions table
export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  shopId: uuid('shop_id').notNull().references(() => shops.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastActivity: timestamp('last_activity', { withTimezone: true }).defaultNow().notNull(),
})

// Export types
export type Shop = typeof shops.$inferSelect
export type NewShop = typeof shops.$inferInsert
export type Coffee = typeof coffees.$inferSelect
export type NewCoffee = typeof coffees.$inferInsert
export type Pastry = typeof pastries.$inferSelect
export type NewPastry = typeof pastries.$inferInsert
export type PairingRule = typeof pairingRules.$inferSelect
export type NewPairingRule = typeof pairingRules.$inferInsert
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

