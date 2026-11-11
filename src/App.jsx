import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { ShopProvider } from "./data";
import { Header, Footer, WhatsAppFab, ScrollToTop, QuoteProvider } from "./site";
import { Home, Collection, Piece, Bespoke, Workshop, Contact, NotFound } from "./pages";

const Admin = lazy(() => import("./admin"));

function SiteLayout() {
  const { pathname } = useLocation();
  return (
    <QuoteProvider>
      <Header />
      <main id="main" className={pathname === "/" ? "main--flush" : undefined}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
    </QuoteProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<Suspense fallback={<div className="login" />}><Admin /></Suspense>} />
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/piece/:slug" element={<Piece />} />
            <Route path="/bespoke" element={<Bespoke />} />
            <Route path="/workshop" element={<Workshop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ShopProvider>
    </BrowserRouter>
  );
}
