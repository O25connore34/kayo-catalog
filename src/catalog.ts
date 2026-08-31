import {
  seedCities,
  seedHotels,
  seedReviews,
  seedRoutes,
  seedTickets,
} from "../lib/seed-data";

export type City = (typeof seedCities)[number];
export type Hotel = (typeof seedHotels)[number];
export type Ticket = (typeof seedTickets)[number];
export type Route = (typeof seedRoutes)[number];
export type Review = (typeof seedReviews)[number];

export const cities: City[] = [...seedCities];
export const hotels: Hotel[] = [...seedHotels];
export const tickets: Ticket[] = [...seedTickets];
export const routes: Route[] = [...seedRoutes];
export const reviews: Review[] = [...seedReviews];

export function listHotels(cityId?: string) {
  if (!cityId) return hotels;
  return hotels.filter((h) => h.cityId === cityId);
}

export function getHotel(slug: string) {
  return hotels.find((h) => h.slug === slug);
}

export function getHotelById(id: string) {
  return hotels.find((h) => h.id === id);
}

export function listTickets(fromId?: string, toId?: string) {
  return tickets.filter((t) => {
    if (fromId && t.fromCityId !== fromId) return false;
    if (toId && t.toCityId !== toId) return false;
    return true;
  });
}

export function getTicket(slug: string) {
  return tickets.find((t) => t.slug === slug);
}

export function getTicketById(id: string) {
  return tickets.find((t) => t.id === id);
}

export function listRoutes(nights?: number) {
  if (!nights) return routes;
  return routes.filter((r) => r.nights === nights);
}

export function getRoute(slug: string) {
  return routes.find((r) => r.slug === slug);
}

export function getRouteById(id: string) {
  return routes.find((r) => r.id === id);
}

export function listReviews(targetKind?: string, targetId?: string) {
  return reviews.filter((r) => {
    if (targetKind && r.targetKind !== targetKind) return false;
    if (targetId && r.targetId !== targetId) return false;
    return true;
  });
}

export function cityName(id: string, locale: "ja" | "en" | "zh") {
  const c = cities.find((x) => x.id === id);
  if (!c) return id;
  return locale === "ja" ? c.nameJa : locale === "zh" ? c.nameZh : c.nameEn;
}
