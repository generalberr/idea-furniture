// Link previews. WhatsApp, Facebook and friends do not run JavaScript, so a
// shared /piece/... link would always show the generic site card. vercel.json
// sends only those crawlers here; they get the piece's own photo, name and price.
// People never reach this file, so a failure here cannot break the site.
const URL = "https://iqqdoswqrqqykskidakv.supabase.co";
const KEY = "sb_publishable_7KK8iwAdCziIp0Qo15hC2Q_cxiWPzG2";

const slugify = (s) =>
  String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

module.exports = async (req, res) => {
  const host = `https://${req.headers["x-forwarded-host"] || req.headers.host}`;
  const slug = String((req.query && req.query.slug) || "");
  let title = "IDEA — Solid-wood furniture, made to measure in Lebanon";
  let desc = "Designed with you, built to your measurements in our own workshop.";
  let image = `${host}/og-image.jpg`;
  try {
    const r = await fetch(`${URL}/rest/v1/products?select=id,name,material,price,description,colors,image_url`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    });
    if (r.ok) {
      const rows = await r.json();
      const p = rows.find((x) => slugify(x.name) === slug || `${slugify(x.name)}-${x.id}` === slug);
      if (p) {
        const photo = (p.colors && p.colors[0] && p.colors[0].photo) || p.image_url;
        title = `${p.name} — IDEA Furniture`;
        desc = [p.material, p.price ? `From $${Number(p.price).toLocaleString("en-US")}` : "", "Made to measure in Lebanon"].filter(Boolean).join(". ") + ".";
        if (photo) image = /^https?:/.test(photo) ? photo : `${host}${photo}`;
      }
    }
  } catch (e) {
    /* fall through to the generic card */
  }
  const url = `${host}/piece/${encodeURIComponent(slug)}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=600");
  res.status(200).send(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:site_name" content="IDEA Furniture">
<meta property="og:type" content="product">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:url" content="${esc(url)}">
<meta name="twitter:card" content="summary_large_image">
</head><body><a href="${esc(url)}">${esc(title)}</a></body></html>`);
};
