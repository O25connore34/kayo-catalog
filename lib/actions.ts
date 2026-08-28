"use server";

import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "./db";
import { bookings, hotels, routes, tickets } from "./schema";
import { nightsBetween } from "./format";

const schema = z.object({
  kind: z.enum(["hotel", "ticket", "route"]),
  itemId: z.string().min(1),
  locale: z.enum(["ja", "en", "zh"]),
  guestName: z.string().min(1).max(80),
  guestEmail: z.string().email(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  travelDate: z.string().optional(),
  guests: z.coerce.number().int().min(1).max(8),
  seatClass: z.enum(["unreserved", "reserved", "green"]).optional(),
  notes: z.string().max(500).optional(),
});

function refCode(): string {
  const n = randomBytes(3).readUIntBE(0, 3) % 1_000_000;
  return `K-${String(n).padStart(6, "0")}`;
}

export async function createBooking(
  input: z.infer<typeof schema>,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "invalid" };
  }
  const data = parsed.data;
  const db = await getDb();
  let total = 0;

  if (data.kind === "hotel") {
    const [hotel] = await db.select().from(hotels).where(eq(hotels.id, data.itemId));
    if (!hotel) return { ok: false, error: "missing-hotel" };
    if (!data.checkIn || !data.checkOut) return { ok: false, error: "dates" };
    total = hotel.priceFromYen * nightsBetween(data.checkIn, data.checkOut) * data.guests;
  } else if (data.kind === "ticket") {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, data.itemId));
    if (!ticket) return { ok: false, error: "missing-ticket" };
    const seat = data.seatClass ?? "reserved";
    const unit =
      seat === "green"
        ? ticket.priceGreenYen ?? ticket.priceReservedYen
        : seat === "unreserved"
          ? ticket.priceUnreservedYen ?? ticket.priceReservedYen
          : ticket.priceReservedYen;
    total = unit * data.guests;
  } else {
    const [route] = await db.select().from(routes).where(eq(routes.id, data.itemId));
    if (!route) return { ok: false, error: "missing-route" };
    total = Math.round((route.priceFromYen * data.guests) / 2);
  }

  const id = randomBytes(8).toString("hex");
  await db.insert(bookings).values({
    id,
    ref: refCode(),
    kind: data.kind,
    itemId: data.itemId,
    locale: data.locale,
    guestName: data.guestName,
    guestEmail: data.guestEmail,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    travelDate: data.travelDate,
    guests: data.guests,
    seatClass: data.seatClass,
    totalYen: total,
    notes: data.notes,
    status: "held",
  });

  return { ok: true, id };
}
