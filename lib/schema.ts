import {
  integer,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const cities = pgTable("cities", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  region: text("region").notNull(),
  nameEn: text("name_en").notNull(),
  nameJa: text("name_ja").notNull(),
  nameZh: text("name_zh").notNull(),
  prefectureEn: text("prefecture_en").notNull(),
  prefectureJa: text("prefecture_ja").notNull(),
  prefectureZh: text("prefecture_zh").notNull(),
});

export const hotels = pgTable("hotels", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  cityId: text("city_id").notNull(),
  kind: text("kind").notNull(),
  nameEn: text("name_en").notNull(),
  nameJa: text("name_ja").notNull(),
  nameZh: text("name_zh").notNull(),
  summaryEn: text("summary_en").notNull(),
  summaryJa: text("summary_ja").notNull(),
  summaryZh: text("summary_zh").notNull(),
  bodyEn: text("body_en").notNull(),
  bodyJa: text("body_ja").notNull(),
  bodyZh: text("body_zh").notNull(),
  addressEn: text("address_en").notNull(),
  addressJa: text("address_ja").notNull(),
  addressZh: text("address_zh").notNull(),
  stationEn: text("station_en").notNull(),
  stationJa: text("station_ja").notNull(),
  stationZh: text("station_zh").notNull(),
  walkMinutes: integer("walk_minutes").notNull(),
  priceFromYen: integer("price_from_yen").notNull(),
  rating: real("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  rooms: integer("rooms").notNull(),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  image: text("image").notNull(),
  amenities: text("amenities").notNull(),
});

export const tickets = pgTable("tickets", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  kind: text("kind").notNull(),
  fromCityId: text("from_city_id").notNull(),
  toCityId: text("to_city_id").notNull(),
  operatorEn: text("operator_en").notNull(),
  operatorJa: text("operator_ja").notNull(),
  operatorZh: text("operator_zh").notNull(),
  nameEn: text("name_en").notNull(),
  nameJa: text("name_ja").notNull(),
  nameZh: text("name_zh").notNull(),
  summaryEn: text("summary_en").notNull(),
  summaryJa: text("summary_ja").notNull(),
  summaryZh: text("summary_zh").notNull(),
  durationMin: integer("duration_min").notNull(),
  priceUnreservedYen: integer("price_unreserved_yen"),
  priceReservedYen: integer("price_reserved_yen").notNull(),
  priceGreenYen: integer("price_green_yen"),
  dailyDepartures: integer("daily_departures").notNull(),
  firstDeparture: text("first_departure").notNull(),
  lastDeparture: text("last_departure").notNull(),
  image: text("image").notNull(),
});

export const routes = pgTable("routes", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nights: integer("nights").notNull(),
  priceFromYen: integer("price_from_yen").notNull(),
  region: text("region").notNull(),
  nameEn: text("name_en").notNull(),
  nameJa: text("name_ja").notNull(),
  nameZh: text("name_zh").notNull(),
  summaryEn: text("summary_en").notNull(),
  summaryJa: text("summary_ja").notNull(),
  summaryZh: text("summary_zh").notNull(),
  bodyEn: text("body_en").notNull(),
  bodyJa: text("body_ja").notNull(),
  bodyZh: text("body_zh").notNull(),
  stops: text("stops").notNull(),
  image: text("image").notNull(),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  targetKind: text("target_kind").notNull(),
  targetId: text("target_id").notNull(),
  authorEn: text("author_en").notNull(),
  authorJa: text("author_ja").notNull(),
  authorZh: text("author_zh").notNull(),
  fromEn: text("from_en").notNull(),
  fromJa: text("from_ja").notNull(),
  fromZh: text("from_zh").notNull(),
  bodyEn: text("body_en").notNull(),
  bodyJa: text("body_ja").notNull(),
  bodyZh: text("body_zh").notNull(),
  rating: integer("rating").notNull(),
  stayMonth: text("stay_month").notNull(),
  avatar: text("avatar").notNull(),
});

export const bookings = pgTable("bookings", {
  id: text("id").primaryKey(),
  ref: text("ref").notNull().unique(),
  kind: text("kind").notNull(),
  itemId: text("item_id").notNull(),
  locale: text("locale").notNull(),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  checkIn: text("check_in"),
  checkOut: text("check_out"),
  travelDate: text("travel_date"),
  guests: integer("guests").notNull(),
  seatClass: text("seat_class"),
  totalYen: integer("total_yen").notNull(),
  notes: text("notes"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type City = typeof cities.$inferSelect;
export type Hotel = typeof hotels.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;
export type Route = typeof routes.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
