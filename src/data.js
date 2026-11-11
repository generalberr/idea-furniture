import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { supabase, rowToProduct } from "./supabaseClient";

/* ------------------------------------------------------------------ helpers */

export const slugify = (s) =>
  String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const money = (n) => "$" + (Number(n) || 0).toLocaleString("en-US");

export const digits = (s) => String(s || "").replace(/\D/g, "");

/** wa.me link, or null when no WhatsApp number has been set yet. */
export const waLink = (number, text) => {
  const n = digits(number);
  if (n.length < 8) return null;
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
};

/** "W220 × D90 × H75 cm" -> { w:220, d:90, h:75 } (null when it can't be read). */
export const parseDims = (s) => {
  const get = (k) => {
    const m = String(s || "").match(new RegExp(k + "\\s*:?\\s*(\\d+(?:\\.\\d+)?)", "i"));
    return m ? Number(m[1]) : null;
  };
  const w = get("W"), d = get("D"), h = get("H");
  return w && d && h ? { w, d, h } : null;
};
export const formatDims = ({ w, d, h }) => `W${w} × D${d} × H${h} cm`;

/** The photo for a finish, honouring a size-specific photo when one exists. */
export const photoFor = (product, colorIndex = 0, size) => {
  const c = (product && product.colors && (product.colors[colorIndex] || product.colors[0])) || null;
  if (!c) return null;
  return (size && c.photos && c.photos[size]) || c.photo || null;
};

/** Badges we are willing to show. Old "Bestseller"/"Popular" tags become nothing
 *  or "Signature" — the shop is new, so the site makes no sales claims. */
export const badgeFor = (tag) => {
  const t = String(tag || "").toLowerCase();
  if (t === "new") return "New";
  if (t === "signature" || t === "bestseller") return "Signature";
  return "";
};

export const CATEGORY_ORDER = ["Living Room", "Bedroom", "Dining", "Office", "Entryway"];
export const sortCategories = (cats) =>
  [...cats].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a), ib = CATEGORY_ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
  });

/* ---------------------------------------------------------- built-in catalog */
/* A snapshot of the collection that ships with the site. It is shown only when
   the database cannot be reached (for example, a paused Supabase project), so
   the shop never appears empty. It is also what "Import starter catalogue"
   loads in the admin. */

const one = (n, h, photo) => [{ n, h, photo }];
const BEDS = ["Queen 160 cm", "King 180 cm", "Super king 200 cm"];
const CORNERS = ["Standard L", "Large L", "Made to measure"];
const WALLS = (a, b) => [`${a} cm`, `${b} cm`, "Full wall, made to measure"];

export const CATALOG = [
  { id: 1, cat: "Living Room", name: "Arc Sofa", mat: "Linen on a solid walnut base", price: 2400, tag: "Signature",
    desc: "A low, rounded sofa on an exposed walnut plinth. Deep seat, loose back cushions, and arms that curve in rather than box you out. Made as a two-seater, a three-seater or a corner.",
    dims: "W220 × D90 × H75 cm", sizes: ["2-Seater", "3-Seater", "Corner L-Shape"],
    colors: [
      { n: "Sand", h: "#C9B99A", photo: "/sofa-sand.jpg", photos: { "2-Seater": "/2seater-sand.jpg", "3-Seater": "/sofa-sand.jpg", "Corner L-Shape": "/corner-sand.jpg" } },
      { n: "Slate", h: "#6B7280", photo: "/sofa-slate.jpg", photos: { "2-Seater": "/2seater-slate.jpg", "3-Seater": "/sofa-slate.jpg", "Corner L-Shape": "/corner-slate.jpg" } },
      { n: "Onyx", h: "#2C2C2C", photo: "/sofa-onyx.jpg", photos: { "2-Seater": "/2seater-onyx.jpg", "3-Seater": "/sofa-onyx.jpg", "Corner L-Shape": "/corner-onyx.jpg" } },
      { n: "Ivory", h: "#E8E0D5", photo: "/sofa-ivory.jpg", photos: { "2-Seater": "/2seater-ivory.jpg", "3-Seater": "/sofa-ivory.jpg", "Corner L-Shape": "/corner-ivory.jpg" } },
    ] },
  { id: 32, cat: "Living Room", name: "Curved Bouclé Corner I", mat: "Bouclé, oak legs", price: 1350, tag: "New",
    desc: "A corner sofa with no straight line in it. The chaise wraps round to close the seating into a conversation, and the whole piece stands on turned oak legs.",
    dims: "W280 × D200 × H80 cm", sizes: CORNERS, colors: one("Ivory bouclé", "#E8E0D5", "/corner-curved-1.jpg") },
  { id: 33, cat: "Living Room", name: "Curved Bouclé Corner II", mat: "Bouclé, oak legs", price: 1350, tag: "Signature",
    desc: "An open, sweeping curve in ivory bouclé. It reads more like a sculpture than a sofa until you sit in it. Round oak legs, open chaise end.",
    dims: "W270 × D190 × H78 cm", sizes: CORNERS, colors: one("Ivory bouclé", "#E8E0D5", "/corner-curved-2.jpg") },
  { id: 34, cat: "Living Room", name: "Deep L Corner Sofa", mat: "Bouclé on a walnut frame", price: 1350, tag: "",
    desc: "Extra-deep seats on a walnut frame you can see: rail, legs and all. Built for lying down as much as sitting up.",
    dims: "W300 × D210 × H82 cm", sizes: CORNERS, colors: one("Ivory on walnut", "#C9B99A", "/corner-deep.jpg") },
  { id: 35, cat: "Living Room", name: "Classic L Corner Sofa", mat: "Linen on a walnut base", price: 1350, tag: "",
    desc: "A structured three-seat corner with a walnut base rail and tapered legs. Upright enough for guests, soft enough for a Sunday.",
    dims: "W290 × D200 × H85 cm", sizes: CORNERS, colors: one("Sand linen", "#C9B99A", "/corner-classic.jpg") },
  { id: 36, cat: "Living Room", name: "Clean L Corner Sofa", mat: "Linen on a walnut base", price: 1350, tag: "New",
    desc: "Slim arms, bolster cushions and a walnut base that lifts the sofa clear of the floor. The quiet one of the family.",
    dims: "W295 × D205 × H83 cm", sizes: CORNERS, colors: one("Ivory linen", "#E8E0D5", "/corner-clean.jpg") },
  { id: 37, cat: "Living Room", name: "Grand U-Shape Sofa", mat: "Linen, solid walnut side panels", price: 1350, tag: "",
    desc: "A modular U for a big room and a big family. Slate cushions sit inside solid walnut end panels, and the sections can be arranged to suit the space.",
    dims: "W380 × D300 × H85 cm", sizes: ["Standard U", "Large U", "Made to measure"], colors: one("Slate", "#6B6B6B", "/corner-ushape.jpg") },
  { id: 11, cat: "Living Room", name: "Walnut Media Wall", mat: "Solid dark walnut", price: 800, tag: "Signature",
    desc: "A wall-hung media cabinet with a matching open shelf above. Closed doors for the boxes and cables, open bays for the things worth showing.",
    dims: "W220 × D40 × H160 cm", sizes: WALLS(220, 260), colors: one("Dark walnut", "#5C3D2E", "/tv-walnut.jpg") },
  { id: 17, cat: "Living Room", name: "Noir Media Wall", mat: "Ebonized solid wood", price: 800, tag: "New",
    desc: "Wood stained close to black so the grain still shows through. A long, low cabinet with an open centre bay and a display shelf above.",
    dims: "W240 × D40 × H170 cm", sizes: WALLS(240, 280), colors: one("Ebonized", "#1F1B19", "/tv-ebonized.jpg") },
  { id: 18, cat: "Living Room", name: "Ash Media Wall", mat: "Light ash", price: 800, tag: "",
    desc: "Pale ash with small black pulls. Drawers at the ends, doors in the middle, and a floating shelf that runs the full width.",
    dims: "W200 × D40 × H160 cm", sizes: WALLS(200, 240), colors: one("Light ash", "#C9A96E", "/tv-ash.jpg") },
  { id: 19, cat: "Living Room", name: "Oak Media Wall", mat: "Solid natural oak", price: 800, tag: "",
    desc: "Four flush doors in natural oak, grain running straight across all of them. Nothing on show but the wood.",
    dims: "W220 × D40 × H165 cm", sizes: WALLS(220, 260), colors: one("Natural oak", "#B8945F", "/tv-oak.jpg") },

  { id: 25, cat: "Bedroom", name: "Oak Tufted Bed", mat: "Solid oak, linen headboard", price: 1200, tag: "Signature",
    desc: "A tall button-tufted headboard held between turned oak posts. Traditional in outline, light in colour.",
    dims: "W180 × D220 × H140 cm", sizes: BEDS, colors: one("Natural oak", "#C9A96E", "/bed-oak-tufted.jpg") },
  { id: 26, cat: "Bedroom", name: "Oak Upholstered Bed", mat: "Solid oak, linen headboard", price: 1200, tag: "New",
    desc: "A plain linen panel in an oak frame with shallow wings. No buttons, no piping.",
    dims: "W180 × D220 × H150 cm", sizes: BEDS, colors: one("Natural oak", "#C9A96E", "/bed-oak-upholstered.jpg") },
  { id: 27, cat: "Bedroom", name: "Oak Wide Bed", mat: "Solid oak, linen headboard", price: 1200, tag: "",
    desc: "A square-tufted headboard framed in oak, on a low base with tapered legs.",
    dims: "W200 × D220 × H120 cm", sizes: BEDS, colors: one("Natural oak", "#C9A96E", "/bed-oak-wide.jpg") },
  { id: 28, cat: "Bedroom", name: "Walnut Curved Bed", mat: "Solid walnut", price: 1200, tag: "",
    desc: "The headboard is a single wide board with its natural edge left along the top. All wood, no upholstery.",
    dims: "W180 × D220 × H100 cm", sizes: BEDS, colors: one("Walnut", "#6B4A36", "/bed-walnut-curved.jpg") },
  { id: 29, cat: "Bedroom", name: "Walnut Boho Bed", mat: "Solid walnut", price: 1200, tag: "New",
    desc: "A gently arched walnut headboard on a simple post frame. Warm, plain and easy to live with.",
    dims: "W180 × D220 × H95 cm", sizes: BEDS, colors: one("Walnut", "#6B4A36", "/bed-walnut-boho.jpg") },
  { id: 30, cat: "Bedroom", name: "Walnut Platform Bed", mat: "Solid walnut", price: 1200, tag: "Signature",
    desc: "A very low platform that appears to float, with a bedside ledge built into each side of the headboard.",
    dims: "W200 × D230 × H80 cm", sizes: BEDS, colors: one("Walnut", "#5C3D2E", "/bed-walnut-platform.jpg") },
  { id: 31, cat: "Bedroom", name: "Walnut Room Bed", mat: "Solid walnut", price: 1200, tag: "",
    desc: "A low platform bed with a slab headboard, made to be ordered with its matching bedside tables.",
    dims: "W200 × D230 × H85 cm", sizes: BEDS, colors: one("Walnut", "#5C3D2E", "/bed-walnut-room.jpg") },
  { id: 20, cat: "Bedroom", name: "Walnut Double Dresser", mat: "Solid dark walnut", price: 400, tag: "Signature",
    desc: "Two columns of deep drawers with no handles to interrupt the grain. Push to open.",
    dims: "W140 × D45 × H80 cm", sizes: ["140 cm", "160 cm"], colors: one("Dark walnut", "#5C3D2E", "/dresser-walnut-double.jpg") },
  { id: 21, cat: "Bedroom", name: "Walnut Low Dresser", mat: "Solid walnut", price: 400, tag: "New",
    desc: "Two wide drawers on splayed legs, with turned wooden knobs. Works just as well as a sideboard.",
    dims: "W120 × D45 × H65 cm", sizes: ["120 cm", "140 cm"], colors: one("Walnut", "#8B5E3C", "/dresser-walnut-low.jpg") },
  { id: 22, cat: "Bedroom", name: "Walnut Mid Dresser", mat: "Solid walnut", price: 400, tag: "",
    desc: "Three drawers with a half-moon cut in place of a handle, and sapwood left in for contrast.",
    dims: "W90 × D45 × H75 cm", sizes: ["90 cm", "110 cm"], colors: one("Walnut", "#6B4A36", "/dresser-walnut-mid.jpg") },
  { id: 23, cat: "Bedroom", name: "Ash Wide Dresser", mat: "Solid ash, brass pulls", price: 400, tag: "",
    desc: "Three full-width drawers with recessed brass pulls. Golden, open-grained and solid throughout.",
    dims: "W130 × D45 × H75 cm", sizes: ["130 cm", "150 cm"], colors: one("Natural ash", "#C9A96E", "/dresser-ash.jpg") },
  { id: 24, cat: "Bedroom", name: "Oak Grand Dresser", mat: "Solid oak, brass handles", price: 400, tag: "",
    desc: "Six drawers in two columns with slim brass bar handles, on angled legs.",
    dims: "W150 × D45 × H80 cm", sizes: ["150 cm", "170 cm"], colors: one("Natural oak", "#B8945F", "/dresser-oak.jpg") },

  { id: 5, cat: "Entryway", name: "Walnut Tower Cabinet", mat: "Solid dark walnut", price: 350, tag: "Signature",
    desc: "Two tall doors and one shallow drawer, on a recessed plinth. Shoes, bags and everything else behind closed doors.",
    dims: "W90 × D40 × H120 cm", sizes: ["80 cm", "90 cm", "110 cm"], colors: one("Dark walnut", "#5C3D2E", "/shoe-tower.jpg") },
  { id: 14, cat: "Entryway", name: "Walnut Bench", mat: "Solid walnut, linen cushion", price: 350, tag: "New",
    desc: "Sit down, shoes on, shoes away. A rounded walnut shell with six open bays and a fitted cushion on top.",
    dims: "W100 × D35 × H50 cm", sizes: ["80 cm", "100 cm", "120 cm"], colors: one("Walnut and sand", "#8B6F5C", "/shoe-bench.jpg") },
  { id: 15, cat: "Entryway", name: "Oak Slim Cabinet", mat: "Solid natural oak", price: 350, tag: "",
    desc: "A narrow oak cabinet on tapered legs: closed storage above, an open shelf below for the pairs you wear every day.",
    dims: "W80 × D35 × H130 cm", sizes: ["70 cm", "80 cm", "100 cm"], colors: one("Natural oak", "#C9A96E", "/shoe-slim.jpg") },
  { id: 16, cat: "Entryway", name: "Ash Sideboard", mat: "Solid ash, brass handles", price: 350, tag: "",
    desc: "Long, low and four doors wide. Shoe storage inside, a console for keys and flowers on top.",
    dims: "W160 × D40 × H55 cm", sizes: ["160 cm", "200 cm", "Made to measure"], colors: one("Smoked ash", "#9B8B7A", "/shoe-sideboard.jpg") },
];

/** Carry size-specific photos over to a database row that predates them. */
const withBundledPhotos = (p) => {
  const base = CATALOG.find((c) => c.name === p.name);
  if (!base) return p;
  return {
    ...p,
    colors: p.colors.map((c) => {
      if (c.photos) return c;
      const match = base.colors.find((b) => b.n === c.n);
      return match && match.photos ? { ...c, photos: match.photos } : c;
    }),
  };
};

/* ------------------------------------------------------------------ settings */

export const DEFAULT_SETTINGS = {
  whatsapp: "", phone: "", email: "", city: "", address: "", mapsUrl: "", hours: "",
  instagram: "", facebook: "", tiktok: "",
  leadTime: "",
  featured: ["Curved Bouclé Corner II", "Walnut Media Wall", "Oak Tufted Bed", "Walnut Bench", "Walnut Low Dresser"],
  testimonials: [],
};

/* --------------------------------------------------------------------- store */

const Ctx = createContext(null);
export const useShop = () => useContext(Ctx);

// Last good answer from the database, kept in the browser so return visits open instantly.
const remember = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ } };
const recall = (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } };

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(() => { const c = recall("idea.products"); return Array.isArray(c) && c.length ? c : null; }); // null = still loading
  const [source, setSource] = useState("loading"); // loading | live | offline
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...(recall("idea.settings") || {}) }));
  const [settingsLive, setSettingsLive] = useState(false);

  const refreshProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
      if (error) throw error;
      const list = (data || []).map(rowToProduct).map(withBundledPhotos);
      setProducts(list);
      remember("idea.products", list);
      setSource("live");
      return true;
    } catch (e) {
      // Database unreachable: show the built-in collection rather than an empty shop.
      setProducts((prev) => prev || CATALOG);
      setSource((prev) => (prev === "live" ? prev : "offline"));
      return false;
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("site_settings").select("data").eq("id", 1).maybeSingle();
      if (error) throw error;
      if (data) {
        setSettings({ ...DEFAULT_SETTINGS, ...(data.data || {}) });
        remember("idea.settings", data.data || {});
        setSettingsLive(true);
      }
    } catch (e) {
      /* table not created yet — defaults stay in place */
    }
  }, []);

  useEffect(() => {
    // Never leave visitors staring at placeholders: after 4s fall back to the built-in set.
    const t = setTimeout(() => {
      setProducts((prev) => prev || CATALOG);
      setSource((prev) => (prev === "loading" ? "offline" : prev));
    }, 4000);
    refreshProducts().finally(() => clearTimeout(t));
    refreshSettings();
    return () => clearTimeout(t);
  }, [refreshProducts, refreshSettings]);

  const value = useMemo(() => {
    const list = (products || []).map((p) => p); // stable copy
    const names = {};
    list.forEach((p) => { const s = slugify(p.name); names[s] = (names[s] || 0) + 1; });
    const withSlugs = list.map((p) => {
      const s = slugify(p.name) || "piece";
      return { ...p, slug: names[s] > 1 ? `${s}-${p.id}` : s };
    });
    const findBySlug = (slug) =>
      withSlugs.find((p) => p.slug === slug) || withSlugs.find((p) => slugify(p.name) === slug) || null;
    const categories = sortCategories([...new Set(withSlugs.map((p) => p.cat))]);
    const featuredKeys = Array.isArray(settings.featured) ? settings.featured : [];
    let featured = featuredKeys.map((k) => withSlugs.find((p) => p.name === k || String(p.id) === String(k))).filter(Boolean);
    if (featured.length < 3) featured = withSlugs.filter((p) => photoFor(p)).slice(0, 5);
    return {
      loading: products === null, source, products: withSlugs, categories, featured, findBySlug,
      settings, settingsLive, refreshProducts, refreshSettings,
    };
  }, [products, source, settings, settingsLive, refreshProducts, refreshSettings]);

  return React.createElement(Ctx.Provider, { value }, children);
}

/* ------------------------------------------------------------------ requests */

/** Save a customer request. Returns { saved }. Never throws. */
export async function sendRequest(req) {
  const row = {
    kind: req.kind || "quote",
    name: String(req.name || "").trim().slice(0, 120),
    phone: String(req.phone || "").trim().slice(0, 40) || null,
    email: String(req.email || "").trim().slice(0, 160) || null,
    area: String(req.area || "").trim().slice(0, 120) || null,
    piece: req.piece || null,
    finish: req.finish || null,
    size: req.size || null,
    message: String(req.message || "").trim().slice(0, 4000) || null,
    details: req.details || {},
  };
  try {
    const { error } = await supabase.from("requests").insert(row);
    if (error) throw error;
    return { saved: true };
  } catch (e) {
    return { saved: false };
  }
}

/** The WhatsApp text for a request, written the way a customer would write it. */
export function requestText(req) {
  const lines = [];
  if (req.kind === "bespoke") {
    lines.push("Hello IDEA, I'd like a bespoke piece made.");
    const d = req.details || {};
    if (d.type) lines.push(`Piece: ${d.type}`);
    if (d.size) lines.push(`Size: ${d.size}`);
    if (d.wood) lines.push(`Wood: ${d.wood}`);
    if (d.fabric) lines.push(`Upholstery: ${d.fabric}`);
    if (d.budget) lines.push(`Budget: ${d.budget}`);
  } else if (req.piece) {
    lines.push(`Hello IDEA, I'd like a quote for the ${req.piece}.`);
    if (req.finish) lines.push(`Finish: ${req.finish}`);
    if (req.size) lines.push(`Size: ${req.size}`);
  } else {
    lines.push("Hello IDEA, I have a question about a piece of furniture.");
  }
  if (req.message) lines.push("", req.message);
  const who = [req.name, req.area].filter(Boolean).join(", ");
  if (who) lines.push("", `— ${who}`);
  return lines.join("\n");
}
