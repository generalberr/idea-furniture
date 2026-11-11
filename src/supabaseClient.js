import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iqqdoswqrqqykskidakv.supabase.co";
// Publishable key: safe in the browser. What it may do is decided by the
// row-level-security policies in supabase/setup.sql.
const SUPABASE_KEY = "sb_publishable_7KK8iwAdCziIp0Qo15hC2Q_cxiWPzG2";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export const IMAGE_BUCKET = "product-images";

const cleanColors = (colors, imageUrl) => {
  const list = Array.isArray(colors) ? colors.filter((c) => c && typeof c === "object") : [];
  if (list.length === 0) return [{ n: "Natural", h: "#8B6F5C", photo: imageUrl || null }];
  return list.map((c) => ({
    n: String(c.n || "Natural"),
    h: /^#[0-9a-f]{3,8}$/i.test(c.h || "") ? c.h : "#8B6F5C",
    photo: c.photo || null,
    ...(c.photos && typeof c.photos === "object" ? { photos: c.photos } : {}),
  }));
};

// Database row -> the shape the site uses. Every field is defended: a missing
// price or colour must never be able to blank the page.
export function rowToProduct(row) {
  return {
    id: row.id,
    cat: row.category || "Other",
    name: row.name || "Untitled piece",
    mat: row.material || "",
    price: Number(row.price) || 0,
    tag: row.tag || "",
    desc: row.description || "",
    dims: row.dimensions || "",
    colors: cleanColors(row.colors, row.image_url),
    sizes: Array.isArray(row.sizes) ? row.sizes.filter(Boolean).map(String) : [],
  };
}

export function productToRow(p) {
  const colors = cleanColors(p.colors, null);
  return {
    name: String(p.name || "").trim(),
    category: p.cat || "Other",
    material: p.mat || "",
    price: Math.max(0, Math.round(Number(p.price) || 0)),
    tag: p.tag || "",
    description: p.desc || "",
    dimensions: p.dims || "",
    colors,
    sizes: Array.isArray(p.sizes) ? p.sizes.filter(Boolean) : [],
    image_url: colors[0].photo || null,
  };
}
