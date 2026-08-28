import { PGlite } from "@electric-sql/pglite";
import { drizzle, type PgliteDatabase } from "drizzle-orm/pglite";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import * as schema from "./schema";
import {
  seedCities,
  seedHotels,
  seedReviews,
  seedRoutes,
  seedTickets,
} from "./seed-data";

type Db = PgliteDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  kayoDb?: Db;
  kayoReady?: Promise<Db>;
};

const CREATE_SQL = `
CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ja TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  prefecture_en TEXT NOT NULL,
  prefecture_ja TEXT NOT NULL,
  prefecture_zh TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS hotels (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  city_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ja TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  summary_ja TEXT NOT NULL,
  summary_zh TEXT NOT NULL,
  body_en TEXT NOT NULL,
  body_ja TEXT NOT NULL,
  body_zh TEXT NOT NULL,
  address_en TEXT NOT NULL,
  address_ja TEXT NOT NULL,
  address_zh TEXT NOT NULL,
  station_en TEXT NOT NULL,
  station_ja TEXT NOT NULL,
  station_zh TEXT NOT NULL,
  walk_minutes INTEGER NOT NULL,
  price_from_yen INTEGER NOT NULL,
  rating REAL NOT NULL,
  review_count INTEGER NOT NULL,
  rooms INTEGER NOT NULL,
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  image TEXT NOT NULL,
  amenities TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL,
  from_city_id TEXT NOT NULL,
  to_city_id TEXT NOT NULL,
  operator_en TEXT NOT NULL,
  operator_ja TEXT NOT NULL,
  operator_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ja TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  summary_ja TEXT NOT NULL,
  summary_zh TEXT NOT NULL,
  duration_min INTEGER NOT NULL,
  price_unreserved_yen INTEGER,
  price_reserved_yen INTEGER NOT NULL,
  price_green_yen INTEGER,
  daily_departures INTEGER NOT NULL,
  first_departure TEXT NOT NULL,
  last_departure TEXT NOT NULL,
  image TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS routes (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  nights INTEGER NOT NULL,
  price_from_yen INTEGER NOT NULL,
  region TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ja TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  summary_ja TEXT NOT NULL,
  summary_zh TEXT NOT NULL,
  body_en TEXT NOT NULL,
  body_ja TEXT NOT NULL,
  body_zh TEXT NOT NULL,
  stops TEXT NOT NULL,
  image TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  target_kind TEXT NOT NULL,
  target_id TEXT NOT NULL,
  author_en TEXT NOT NULL,
  author_ja TEXT NOT NULL,
  author_zh TEXT NOT NULL,
  from_en TEXT NOT NULL,
  from_ja TEXT NOT NULL,
  from_zh TEXT NOT NULL,
  body_en TEXT NOT NULL,
  body_ja TEXT NOT NULL,
  body_zh TEXT NOT NULL,
  rating INTEGER NOT NULL,
  stay_month TEXT NOT NULL,
  avatar TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL,
  item_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  check_in TEXT,
  check_out TEXT,
  travel_date TEXT,
  guests INTEGER NOT NULL,
  seat_class TEXT,
  total_yen INTEGER NOT NULL,
  notes TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
`;

async function seed(db: Db, client: PGlite) {
  const existing = await client.query<{ n: number }>(
    "SELECT COUNT(*)::int AS n FROM cities",
  );
  const n = Number(existing.rows[0]?.n ?? 0);
  if (n > 0) return;

  await db.insert(schema.cities).values([...seedCities]);
  await db.insert(schema.hotels).values([...seedHotels]);
  await db.insert(schema.tickets).values([...seedTickets]);
  await db.insert(schema.routes).values([...seedRoutes]);
  await db.insert(schema.reviews).values([...seedReviews]);
}

async function createDb(): Promise<Db> {
  const onVercel = Boolean(process.env.VERCEL);
  const asciiCwd = /^[\x00-\x7F]+$/.test(process.cwd());
  const dataDir = onVercel
    ? path.join(os.tmpdir(), "kayo-pglite")
    : asciiCwd
      ? path.join(process.cwd(), "data", "pglite")
      : path.join(os.homedir(), ".kayo-pglite");
  if (!onVercel) fs.mkdirSync(dataDir, { recursive: true });
  const client = onVercel ? new PGlite() : new PGlite(dataDir);
  await client.waitReady;
  await client.exec(CREATE_SQL);
  const db = drizzle(client, { schema });
  await seed(db, client);
  return db;
}

export function getDb(): Promise<Db> {
  if (globalForDb.kayoDb) return Promise.resolve(globalForDb.kayoDb);
  if (!globalForDb.kayoReady) {
    globalForDb.kayoReady = createDb().then((db) => {
      globalForDb.kayoDb = db;
      return db;
    });
  }
  return globalForDb.kayoReady;
}
