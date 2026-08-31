import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LocaleLayout } from "./LocaleLayout";
import { defaultLocale } from "./locale";
import { BookingPage } from "./pages/BookingPage";
import { DeskPage } from "./pages/DeskPage";
import { HomePage } from "./pages/HomePage";
import { HotelDetailPage } from "./pages/HotelDetailPage";
import { HotelsPage } from "./pages/HotelsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RouteDetailPage } from "./pages/RouteDetailPage";
import { RoutesPage } from "./pages/RoutesPage";
import { TicketDetailPage } from "./pages/TicketDetailPage";
import { TicketsPage } from "./pages/TicketsPage";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Navigate to={`/${defaultLocale}`} replace />} />
        <Route path="/:locale" element={<LocaleLayout />}>
          <Route index element={<HomePage />} />
          <Route path="hotels" element={<HotelsPage />} />
          <Route path="hotels/:slug" element={<HotelDetailPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/:slug" element={<TicketDetailPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="routes/:slug" element={<RouteDetailPage />} />
          <Route path="desk" element={<DeskPage />} />
          <Route path="bookings/:id" element={<BookingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="*" element={<Navigate to={`/${defaultLocale}`} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
