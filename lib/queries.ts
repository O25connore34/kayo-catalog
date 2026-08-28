import { eq, or, ilike } from "drizzle-orm";
import { getDb } from "./db";
import { bookings, cities, hotels, reviews, routes, tickets } from "./schema";

export async function listCities() {
  const db = await getDb();
  return db.select().from(cities);
}

export async function listHotels(cityId?: string) {
  const db = await getDb();
  const rows = await db.select().from(hotels);
  if (!cityId) return rows;
  return rows.filter((h) => h.cityId === cityId);
}

export async function getHotel(slug: string) {
  const db = await getDb();
  const [row] = await db.select().from(hotels).where(eq(hotels.slug, slug));
  return row ?? null;
}

export async function listTickets(fromId?: string, toId?: string) {
  const db = await getDb();
  const rows = await db.select().from(tickets);
  return rows.filter((t) => {
    if (fromId && t.fromCityId !== fromId) return false;
    if (toId && t.toCityId !== toId) return false;
    return true;
  });
}

export async function getTicket(slug: string) {
  const db = await getDb();
  const [row] = await db.select().from(tickets).where(eq(tickets.slug, slug));
  return row ?? null;
}

export async function listRoutes(nights?: number) {
  const db = await getDb();
  const rows = await db.select().from(routes);
  if (!nights) return rows;
  return rows.filter((r) => r.nights === nights);
}

export async function getRoute(slug: string) {
  const db = await getDb();
  const [row] = await db.select().from(routes).where(eq(routes.slug, slug));
  return row ?? null;
}

export async function listReviews(targetKind?: string, targetId?: string) {
  const db = await getDb();
  const rows = await db.select().from(reviews);
  return rows.filter((r) => {
    if (targetKind && r.targetKind !== targetKind) return false;
    if (targetId && r.targetId !== targetId) return false;
    return true;
  });
}

export async function getBooking(id: string) {
  const db = await getDb();
  const [row] = await db.select().from(bookings).where(eq(bookings.id, id));
  return row ?? null;
}

export async function getHotelById(id: string) {
  const db = await getDb();
  const [row] = await db.select().from(hotels).where(eq(hotels.id, id));
  return row ?? null;
}

export async function getTicketById(id: string) {
  const db = await getDb();
  const [row] = await db.select().from(tickets).where(eq(tickets.id, id));
  return row ?? null;
}

export async function getRouteById(id: string) {
  const db = await getDb();
  const [row] = await db.select().from(routes).where(eq(routes.id, id));
  return row ?? null;
}

export async function searchCatalog(q: string) {
  const query = q.trim();
  if (!query) {
    return { hotels: await listHotels(), tickets: await listTickets(), routes: await listRoutes() };
  }
  const db = await getDb();
  const like = `%${query}%`;
  const [h, t, r] = await Promise.all([
    db
      .select()
      .from(hotels)
      .where(
        or(
          ilike(hotels.nameJa, like),
          ilike(hotels.nameEn, like),
          ilike(hotels.nameZh, like),
          ilike(hotels.summaryJa, like),
          ilike(hotels.summaryEn, like),
        ),
      ),
    db
      .select()
      .from(tickets)
      .where(
        or(
          ilike(tickets.nameJa, like),
          ilike(tickets.nameEn, like),
          ilike(tickets.nameZh, like),
        ),
      ),
    db
      .select()
      .from(routes)
      .where(
        or(
          ilike(routes.nameJa, like),
          ilike(routes.nameEn, like),
          ilike(routes.nameZh, like),
        ),
      ),
  ]);
  return { hotels: h, tickets: t, routes: r };
}
