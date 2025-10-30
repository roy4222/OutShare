/**
 * Drizzle ORM Schema Definition
 *
 * 定義 Outdoor Trails Hub 的資料庫結構
 * 此檔案對應原本的 Prisma schema
 */

import { pgTable, text, uuid, timestamp, jsonb, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// Profiles Table (使用者個人資料)
// ============================================

export const profiles = pgTable('profiles', {
  user_id: uuid('user_id').primaryKey(),
  username: text('username').unique(),
  display_name: text('display_name'),
  bio: text('bio'),
  avatar_url: text('avatar_url'),
  social_links: jsonb('social_links').default({}).$type<Record<string, string>>(),
  gear_dashboard_title: text('gear_dashboard_title'),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

// ============================================
// Trip Table (旅程)
// ============================================

export const trip = pgTable('trip', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => profiles.user_id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location'),
  duration: text('duration'),
  date: date('date', { mode: 'date' }),
  images: text('images').array().default([]).notNull(),
  tags: text('tags').array().default([]).notNull(),
  slug: text('slug').unique(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

// ============================================
// Gear Table (裝備)
// ============================================

export const gear = pgTable('gear', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => profiles.user_id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  category: text('category'),
  description: text('description'),
  image_url: text('image_url'),
  specs: jsonb('specs').$type<Record<string, unknown>>(),
  tags: text('tags').array().default([]).notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

// ============================================
// Trip Gear Table (旅程與裝備的多對多關聯)
// ============================================

export const tripGear = pgTable('trip_gear', {
  id: uuid('id').defaultRandom().primaryKey(),
  trip_id: uuid('trip_id').notNull().references(() => trip.id, { onDelete: 'cascade' }),
  gear_id: uuid('gear_id').notNull().references(() => gear.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

// ============================================
// Relations (關聯定義)
// ============================================

export const profilesRelations = relations(profiles, ({ many }) => ({
  trips: many(trip),
  gear: many(gear),
}));

export const tripRelations = relations(trip, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [trip.user_id],
    references: [profiles.user_id],
  }),
  trip_gear: many(tripGear),
}));

export const gearRelations = relations(gear, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [gear.user_id],
    references: [profiles.user_id],
  }),
  trip_gear: many(tripGear),
}));

export const tripGearRelations = relations(tripGear, ({ one }) => ({
  trip: one(trip, {
    fields: [tripGear.trip_id],
    references: [trip.id],
  }),
  gear: one(gear, {
    fields: [tripGear.gear_id],
    references: [gear.id],
  }),
}));

// ============================================
// Type Exports
// ============================================

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Trip = typeof trip.$inferSelect;
export type NewTrip = typeof trip.$inferInsert;

export type Gear = typeof gear.$inferSelect;
export type NewGear = typeof gear.$inferInsert;

export type TripGear = typeof tripGear.$inferSelect;
export type NewTripGear = typeof tripGear.$inferInsert;
