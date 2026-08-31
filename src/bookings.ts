import { getHotelById, getRouteById, getTicketById } from "./catalog";
import { nightsBetween } from "./format";
import type { Locale } from "./locale";

export type BookingKind = "hotel" | "ticket" | "route";
export type SeatClass = "unreserved" | "reserved" | "green";

export type Booking = {
  id: string;
  ref: string;
  kind: BookingKind;
  itemId: string;
  locale: Locale;
  guestName: string;
  guestEmail: string;
  checkIn?: string;
  checkOut?: string;
  travelDate?: string;
  guests: number;
  seatClass?: SeatClass;
  totalYen: number;
  notes?: string;
  status: "held";
  createdAt: string;
};

const KEY = "kayo-bookings";

function readAll(): Booking[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Booking[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(rows: Booking[]) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

function refCode() {
  const n = Math.floor(Math.random() * 1_000_000);
  return `K-${String(n).padStart(6, "0")}`;
}

function newId() {
  return `${Date.now().toString(16)}${Math.floor(Math.random() * 1e8).toString(16)}`;
}

export function getBooking(id: string) {
  return readAll().find((b) => b.id === id) ?? null;
}

export function createBooking(input: {
  kind: BookingKind;
  itemId: string;
  locale: Locale;
  guestName: string;
  guestEmail: string;
  checkIn?: string;
  checkOut?: string;
  travelDate?: string;
  guests: number;
  seatClass?: SeatClass;
  notes?: string;
}): { ok: true; id: string } | { ok: false } {
  const name = input.guestName.trim();
  const email = input.guestEmail.trim();
  if (!name || !email || !email.includes("@") || input.guests < 1) {
    return { ok: false };
  }

  let total = 0;
  if (input.kind === "hotel") {
    const hotel = getHotelById(input.itemId);
    if (!hotel || !input.checkIn || !input.checkOut) return { ok: false };
    total = hotel.priceFromYen * nightsBetween(input.checkIn, input.checkOut) * input.guests;
  } else if (input.kind === "ticket") {
    const ticket = getTicketById(input.itemId);
    if (!ticket) return { ok: false };
    const seat = input.seatClass ?? "reserved";
    const unit =
      seat === "green"
        ? ticket.priceGreenYen ?? ticket.priceReservedYen
        : seat === "unreserved"
          ? ticket.priceUnreservedYen ?? ticket.priceReservedYen
          : ticket.priceReservedYen;
    total = unit * input.guests;
  } else {
    const route = getRouteById(input.itemId);
    if (!route) return { ok: false };
    total = Math.round((route.priceFromYen * input.guests) / 2);
  }

  const booking: Booking = {
    id: newId(),
    ref: refCode(),
    kind: input.kind,
    itemId: input.itemId,
    locale: input.locale,
    guestName: name,
    guestEmail: email,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    travelDate: input.travelDate,
    guests: input.guests,
    seatClass: input.seatClass,
    totalYen: total,
    notes: input.notes,
    status: "held",
    createdAt: new Date().toISOString(),
  };
  writeAll([...readAll(), booking]);
  return { ok: true, id: booking.id };
}
