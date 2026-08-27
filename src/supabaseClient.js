import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iqqdoswqrqqykskidakv.supabase.co";
const SUPABASE_KEY = "sb_publishable_7KK8iwAdCziIp0Qo15hC2Q_cxiWPzG2";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Convert a DB row (flat columns) into the shape the website's UI expects
export function rowToProduct(row) {
  return {
    id: row.id,
    cat: row.category,
    name: row.name,
    mat: row.material,
    price: row.price,
    tag: row.tag || "New",
    desc: row.description || "",
    dims: row.dimensions || "",
    img: "bookcase", // generic fallback icon if no photo
    colors: (row.colors && row.colors.length > 0) ? row.colors : [{ n: "Natural", h: "#8B6F5C", photo: row.image_url || null }],
    sizes: (row.sizes && row.sizes.length > 0) ? row.sizes : ["Standard"],
  };
}

// Convert a UI product object into DB row columns for insert/update
export function productToRow(p) {
  return {
    name: p.name,
    category: p.cat,
    material: p.mat,
    price: Number(p.price) || 0,
    tag: p.tag || "New",
    description: p.desc || "",
    dimensions: p.dims || "",
    colors: p.colors || [],
    sizes: p.sizes || [],
    image_url: (p.colors && p.colors[0] && p.colors[0].photo) || null,
  };
}
