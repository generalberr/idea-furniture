import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useShop, money, waLink, photoFor, badgeFor, parseDims, sendRequest, requestText, digits } from "./data";
import { Pic, ProductCard, CardSkeletons, IsoBox, QuoteForm, Lightbox, WhatsAppIcon, useQuote, useTitle } from "./site";

const WOODS = [
  { key: "Walnut", img: "/wood-walnut.jpg", text: "Dark, warm and richly figured. The wood most of our pieces start from." },
  { key: "Oak", img: "/wood-oak.jpg", text: "Pale gold with a strong, straight grain. Hard-wearing and calm." },
  { key: "Ash", img: "/wood-ash.jpg", text: "Light and open-grained, with a sweeping cathedral figure." },
  { key: "Ebonized", img: "/wood-ebonized.jpg", text: "Stained near-black so the grain still reads through the colour." },
];

const usePlace = () => {
  const { settings } = useShop();
  return settings.city ? `${settings.city}, Lebanon` : "Lebanon";
};

/* ====================================================================== Home */

const SHAPES = [
  { label: "A sofa for the long wall", w: 260, d: 95, h: 78 },
  { label: "A dining table for ten", w: 280, d: 105, h: 76 },
  { label: "A wardrobe, floor to ceiling", w: 180, d: 62, h: 270 },
  { label: "A bedside that fits the gap", w: 46, d: 40, h: 58 },
  { label: "A media wall, end to end", w: 340, d: 42, h: 55 },
];

function ShapeCycle() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % SHAPES.length), 3200);
    return () => clearInterval(t);
  }, []);
  const s = SHAPES[i];
  return (
    <div className="iso-wrap">
      <IsoBox w={s.w} d={s.d} h={s.h} label={s.label} />
      <div className="iso-caption">
        <strong>{s.label}</strong>
        <span>{s.w} × {s.d} × {s.h} cm</span>
      </div>
    </div>
  );
}

const ROOM_PICKS = { "Living Room": "Deep L Corner Sofa", Bedroom: "Walnut Platform Bed", Entryway: "Oak Slim Cabinet" };

export function Home() {
  useTitle("");
  const { loading, featured, products, categories, settings } = useShop();
  const openQuote = useQuote();
  const place = usePlace();
  const heroPiece = products.find((p) => p.name === "Curved Bouclé Corner II");
  const voices = (settings.testimonials || []).filter((t) => t && t.text && t.name);

  const rooms = categories.map((c) => {
    const inRoom = products.filter((p) => p.cat === c && photoFor(p));
    if (!inRoom.length) return null;
    const pick = inRoom.find((p) => p.name === ROOM_PICKS[c]) || inRoom[inRoom.length - 1];
    return { name: c, count: inRoom.length, photo: photoFor(pick) };
  }).filter(Boolean);

  useEffect(() => {
    const ld = {
      "@context": "https://schema.org", "@type": "FurnitureStore", name: "IDEA Furniture",
      description: "Solid-wood furniture made to measure in Lebanon.",
      url: window.location.origin, image: window.location.origin + "/og-image.jpg",
      address: { "@type": "PostalAddress", addressCountry: "LB", ...(settings.city ? { addressLocality: settings.city } : {}), ...(settings.address ? { streetAddress: settings.address } : {}) },
      ...(settings.phone ? { telephone: settings.phone } : {}),
    };
    const el = document.createElement("script");
    el.type = "application/ld+json"; el.text = JSON.stringify(ld);
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, [settings.city, settings.address, settings.phone]);

  return (
    <>
      <section className="hero on-dark">
        <img className="hero__img" src="/hero-workshop.jpg" alt="A curved bouclé sofa standing on the workshop floor in late-afternoon light" fetchpriority="high" />
        <div className="wrap hero__in">
          <div>
            <h1 className="display">Where every idea takes form.</h1>
            <p className="hero__sub">Solid-wood furniture, designed with you and built to your measurements in our own workshop in {place}.</p>
            <div className="btn-row">
              <Link className="btn btn--light" to="/bespoke">Start a bespoke piece</Link>
              <Link className="btn btn--ghost-light" to="/collection">See the collection</Link>
            </div>
          </div>
          {heroPiece && (
            <p className="hero__caption">
              In the picture<br /><Link className="link" to={`/piece/${heroPiece.slug}`}>{heroPiece.name}</Link>
            </p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="wrap intro">
          <p className="statement">You bring the room and the idea. We draw it, choose the wood with you, and build it. One piece at a time, for one home.</p>
          <ul className="facts">
            <li><strong>Made to your measurements</strong><span>Every piece in the collection can be resized to the centimetre.</span></li>
            <li><strong>Solid wood</strong><span>Walnut, oak and ash, chosen board by board.</span></li>
            <li><strong>Our own workshop</strong><span>Designed, built and finished under one roof.</span></li>
          </ul>
        </div>
      </section>

      <section className="section section--tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section__head">
            <h2 className="h2">From the collection</h2>
            <Link className="link" to="/collection">See all {products.filter((p) => photoFor(p)).length || ""} pieces</Link>
          </div>
          {loading ? <CardSkeletons n={3} /> : (
            <div className="featured">
              {featured.slice(0, 5).map((p, i) => <ProductCard key={p.id} p={p} eager={i < 2} />)}
            </div>
          )}
        </div>
      </section>

      <section className="section section--dark on-dark">
        <div className="wrap bespoke-band">
          <div>
            <h2 className="h1">Can't find it? We'll build it.</h2>
            <p className="lead">Most of what leaves our workshop was never in a catalogue. Give us the wall, the corner or the awkward gap, and tell us what it has to do. We'll come back with a drawing and a price.</p>
            <div className="btn-row">
              <Link className="btn btn--light" to="/bespoke">Start your brief</Link>
              <Link className="link" to="/workshop">How we work</Link>
            </div>
          </div>
          <ShapeCycle />
        </div>
      </section>

      {rooms.length > 1 && (
        <section className="section">
          <div className="wrap">
            <div className="section__head"><h2 className="h2">By room</h2></div>
            <div className="rooms">
              {rooms.map((r) => (
                <Link key={r.name} className="room" to={`/collection?room=${encodeURIComponent(r.name)}`}>
                  <Pic src={r.photo} alt="" />
                  <span className="room__text"><b>{r.name}</b><span>{r.count} {r.count === 1 ? "piece" : "pieces"}</span></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section--alt">
        <div className="wrap">
          <div className="section__head">
            <div>
              <h2 className="h2">From first message to finished piece</h2>
            </div>
          </div>
          <ol className="steps">
            <li><h3>Tell us the idea</h3><p>Pick a piece from the collection or describe your own. A photo, a sketch or a few measurements is enough to start.</p></li>
            <li><h3>Choose the materials</h3><p>We go through wood, finish, fabric and exact dimensions with you, then confirm the drawing and the price.</p></li>
            <li><h3>We build it</h3><p>Your piece is cut, joined, finished and upholstered in our workshop. Nothing is taken off a shelf.</p></li>
            <li><h3>Delivered and installed</h3><p>We bring it to your home, place it, and make sure it sits right.</p></li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <div>
              <h2 className="h2">The wood</h2>
              <p className="lead">Four finishes cover most of what we make. If you have another timber in mind, ask.</p>
            </div>
          </div>
          <div className="woods">
            {WOODS.map((w) => (
              <div className="wood" key={w.key}>
                <Pic src={w.img} alt={`${w.key} grain`} />
                <h3>{w.key}</h3>
                <p>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {voices.length > 0 && (
        <section className="section section--alt">
          <div className="wrap">
            <div className="section__head"><h2 className="h2">From our customers</h2></div>
            <div className="voices">
              {voices.slice(0, 3).map((t, i) => (
                <figure className="voice" key={i}>
                  <blockquote>“{t.text}”</blockquote>
                  <figcaption>{t.name}{t.place ? `, ${t.place}` : ""}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section--dark on-dark">
        <div className="wrap closing">
          <h2 className="h1">You have an idea. We have the hands.</h2>
          <div>
            <p className="lead">Send us a message with what you have in mind. We'll reply with questions, options and a price.</p>
            <div className="btn-row" style={{ marginTop: 26 }}>
              <button className="btn btn--light" onClick={() => openQuote({})}>Request a quote</button>
              {waLink(settings.whatsapp) && (
                <a className="btn btn--ghost-light" href={waLink(settings.whatsapp, "Hello IDEA, I'd like to ask about a piece of furniture.")} target="_blank" rel="noreferrer"><WhatsAppIcon /> WhatsApp us</a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ================================================================ Collection */

export function Collection() {
  const { loading, products, categories } = useShop();
  const [params, setParams] = useSearchParams();
  const visible = useMemo(() => products.filter((p) => photoFor(p)), [products]);
  const cats = categories.filter((c) => visible.some((p) => p.cat === c));
  const roomParam = params.get("room") || "";
  const room = cats.find((c) => c.toLowerCase() === roomParam.toLowerCase()) || "";
  const sort = params.get("sort") || "";
  useTitle(room ? `${room} furniture` : "The collection");

  const list = useMemo(() => {
    const l = room ? visible.filter((p) => p.cat === room) : visible;
    if (sort === "low") return [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [visible, room, sort]);

  const update = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next, { replace: true });
  };

  return (
    <div className="wrap">
      <header className="page-head">
        <h1 className="h1">{room || "The collection"}</h1>
        <p className="lead">Every piece is made to order. Take it as shown, or change the size, the wood and the fabric.</p>
      </header>
      <div className="toolbar">
        <div className="tabs" role="group" aria-label="Filter by room">
          <button className="tab" aria-pressed={!room} onClick={() => update("room", "")}>All<sup>{visible.length}</sup></button>
          {cats.map((c) => (
            <button key={c} className="tab" aria-pressed={room === c} onClick={() => update("room", c)}>
              {c}<sup>{visible.filter((p) => p.cat === c).length}</sup>
            </button>
          ))}
        </div>
        <label>
          <span className="sr-only">Sort</span>
          <select className="select" value={sort} onChange={(e) => update("sort", e.target.value)}>
            <option value="">Our order</option>
            <option value="low">Price, low to high</option>
            <option value="high">Price, high to low</option>
          </select>
        </label>
      </div>
      {loading ? <CardSkeletons /> : list.length === 0 ? (
        <p className="empty">Nothing here yet. <Link className="link" to="/bespoke">Tell us what you need</Link> and we'll build it.</p>
      ) : (
        <div className="grid" style={{ paddingBottom: "clamp(56px, 8vw, 110px)" }}>
          {list.map((p, i) => <ProductCard key={p.id} p={p} eager={i < 3} />)}
        </div>
      )}
    </div>
  );
}

/* ===================================================================== Piece */

export function Piece() {
  const { slug } = useParams();
  const { loading, findBySlug, products, settings } = useShop();
  const openQuote = useQuote();
  const p = findBySlug(slug);
  const [ci, setCi] = useState(0);
  const [size, setSize] = useState("");
  const [zoom, setZoom] = useState(false);
  const [copied, setCopied] = useState(false);
  useTitle(p ? p.name : loading ? "" : "Piece not found");

  useEffect(() => { setCi(0); setSize(""); }, [slug]);
  useEffect(() => {
    document.body.classList.add("has-buybar");
    return () => document.body.classList.remove("has-buybar");
  }, []);

  if (loading) return <div className="wrap" style={{ paddingBlock: 40 }}><CardSkeletons n={1} /></div>;
  if (!p) return <NotFound what="piece" />;

  const color = p.colors[ci] || p.colors[0];
  const activeSize = size || (p.sizes.includes("3-Seater") ? "3-Seater" : p.sizes[0] || "");
  const photo = photoFor(p, ci, activeSize);
  const dims = parseDims(p.dims);
  const badge = badgeFor(p.tag);
  const context = { piece: p.name, finish: color.n, size: activeSize, photo };
  const wa = waLink(settings.whatsapp, requestText({ ...context, kind: "quote" }) + `\n${window.location.href}`);
  const related = products.filter((x) => x.cat === p.cat && x.id !== p.id && photoFor(x)).slice(0, 3);
  const bespokeHref = `/bespoke?from=${encodeURIComponent(p.name)}${dims ? `&w=${dims.w}&d=${dims.d}&h=${dims.h}` : ""}`;

  const share = async () => {
    const data = { title: `${p.name} — IDEA Furniture`, url: window.location.href };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(data.url);
      setCopied(true); setTimeout(() => setCopied(false), 2200);
    } catch (e) { /* cancelled */ }
  };

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/collection">Collection</Link><span>/</span>
        <Link to={`/collection?room=${encodeURIComponent(p.cat)}`}>{p.cat}</Link><span>/</span>
        <span aria-current="page">{p.name}</span>
      </nav>

      <article className="piece">
        <div className="gallery">
          <button className="gallery__main" onClick={() => photo && setZoom(true)} aria-label="View larger photo">
            <Pic src={photo} alt={`${p.name} in ${color.n}`} eager>{badge && <span className="badge">{badge}</span>}</Pic>
          </button>
          {p.colors.length > 1 && (
            <div className="thumbs">
              {p.colors.map((c, i) => (
                <button key={i} className="thumb" aria-pressed={i === ci} onClick={() => setCi(i)} aria-label={`Show ${c.n}`}>
                  <Pic src={photoFor(p, i, activeSize)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="piece__info">
          <p className="kicker">{p.cat}</p>
          <h1 className="h1">{p.name}</h1>
          {p.mat && <p className="muted" style={{ marginTop: 8 }}>{p.mat}</p>}
          {p.price > 0 && <p className="piece__price">From {money(p.price)}<small>final price depends on size and materials</small></p>}
          {p.desc && <p className="piece__desc">{p.desc}</p>}

          {p.colors.length > 1 && (
            <div className="option">
              <span className="option__label">Finish: <span>{color.n}</span></span>
              <div className="swatches">
                {p.colors.map((c, i) => (
                  <button key={i} className="swatch" style={{ background: c.h }} aria-pressed={i === ci} aria-label={c.n} title={c.n} onClick={() => setCi(i)} />
                ))}
              </div>
            </div>
          )}
          {p.colors.length === 1 && <p className="option small muted">Shown in {color.n.toLowerCase()}. Other woods and fabrics on request.</p>}

          {p.sizes.length > 0 && (
            <div className="option">
              <span className="option__label">Size</span>
              <div className="chips">
                {p.sizes.map((s) => (
                  <button key={s} className="chip" aria-pressed={s === activeSize} onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          <div className="piece__cta">
            <button className="btn btn--block" onClick={() => openQuote(context)}>Request a quote</button>
            {wa && <a className="btn btn--ghost btn--block" href={wa} target="_blank" rel="noreferrer"><WhatsAppIcon /> Ask about this piece on WhatsApp</a>}
          </div>

          {dims && (
            <div className="drawing">
              <IsoBox w={dims.w} d={dims.d} h={dims.h} label={p.name} />
              <div className="drawing__foot">
                <span>As shown: {dims.w} × {dims.d} × {dims.h} cm</span>
                <Link className="link" to={bespokeHref}>Change the measurements</Link>
              </div>
            </div>
          )}
          {!dims && p.dims && <p className="option muted">Dimensions: {p.dims}</p>}

          <ul className="notes">
            <li><b>Made to order.</b> Built for you in our workshop{settings.leadTime ? `, usually ready in ${settings.leadTime}` : ""}.</li>
            <li><b>Natural materials.</b> Grain and tone vary from board to board, so your piece will not be identical to the photo.</li>
            <li><button className="link" onClick={share}>{copied ? "Link copied" : "Share this piece"}</button></li>
          </ul>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section section--tight" style={{ paddingTop: 0 }}>
          <div className="section__head">
            <h2 className="h2">More for the {p.cat.toLowerCase()}</h2>
            <Link className="link" to={`/collection?room=${encodeURIComponent(p.cat)}`}>See all</Link>
          </div>
          <div className="grid">{related.map((x) => <ProductCard key={x.id} p={x} />)}</div>
        </section>
      )}

      <div className="buybar">
        <button className="btn" onClick={() => openQuote(context)}>Request a quote</button>
        {wa && <a className="btn btn--wa" href={wa} target="_blank" rel="noreferrer" aria-label="Ask on WhatsApp"><WhatsAppIcon /></a>}
      </div>
      {zoom && photo && <Lightbox src={photo} alt={`${p.name} in ${color.n}`} onClose={() => setZoom(false)} />}
    </div>
  );
}

/* =================================================================== Bespoke */

const TYPES = [
  { key: "Sofa", size: [220, 90, 75], soft: true },
  { key: "Bed", size: [180, 210, 110], soft: true },
  { key: "Dining table", size: [220, 100, 76] },
  { key: "Coffee table", size: [120, 60, 40] },
  { key: "Media wall", size: [220, 40, 50] },
  { key: "Wardrobe", size: [200, 60, 240] },
  { key: "Dresser", size: [130, 45, 80] },
  { key: "Desk", size: [160, 70, 75] },
  { key: "Shelving", size: [100, 35, 200] },
  { key: "Entryway storage", size: [100, 38, 110] },
  { key: "Something else", size: [120, 60, 80] },
];
const WOOD_CHOICES = ["Walnut", "Oak", "Ash", "Ebonized", "Painted", "Help me choose"];
const FABRICS = ["Linen", "Bouclé", "Velvet", "Leather", "Help me choose"];
const BUDGETS = ["Under $500", "$500 to $1,500", "$1,500 to $3,000", "Over $3,000", "Not sure yet"];

const Chips = ({ options, value, onChange, label }) => (
  <div className="chips" role="group" aria-label={label}>
    {options.map((o) => (
      <button type="button" key={o} className="chip" aria-pressed={value === o} onClick={() => onChange(value === o ? "" : o)}>{o}</button>
    ))}
  </div>
);

export function Bespoke() {
  useTitle("Bespoke furniture");
  const { settings } = useShop();
  const [params] = useSearchParams();
  const from = params.get("from") || "";
  const num = (k) => { const n = Number(params.get(k)); return n > 0 && n < 2000 ? String(n) : ""; };
  const [f, setF] = useState({
    type: "", other: "", w: num("w"), d: num("d"), h: num("h"), wood: "", fabric: "", budget: "",
    message: from ? `Based on the ${from}, with changes: ` : "", name: "", phone: "", area: "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v && v.target ? v.target.value : v }));

  const type = TYPES.find((t) => t.key === f.type);
  const base = type ? type.size : [200, 80, 90];
  const size = [Number(f.w) || base[0], Number(f.d) || base[1], Number(f.h) || base[2]];
  const hasSize = f.w || f.d || f.h;
  const sizeText = hasSize ? `${f.w || "?"} × ${f.d || "?"} × ${f.h || "?"} cm (W × D × H)` : "";
  const typeText = f.type === "Something else" ? (f.other.trim() || "Something else") : f.type;

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!f.type && !from) er.type = "Choose the kind of piece, or pick “Something else”.";
    if (f.name.trim().length < 2) er.name = "Please tell us your name.";
    if (digits(f.phone).length < 7) er.phone = "Please enter a phone number we can reach you on.";
    setErrors(er);
    if (Object.keys(er).length) {
      const first = document.querySelector(er.type ? "#q-type" : "#q-contact");
      if (first) first.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setBusy(true);
    const req = {
      kind: "bespoke", name: f.name, phone: f.phone, area: f.area, message: f.message,
      piece: from || null, size: sizeText || null, finish: f.wood || null,
      details: { type: typeText || (from ? `Based on ${from}` : ""), size: sizeText, wood: f.wood, fabric: f.fabric, budget: f.budget },
    };
    const { saved } = await sendRequest(req);
    const wa = waLink(settings.whatsapp, requestText(req));
    setBusy(false);
    if (!saved && !wa) { setResult({ failed: true }); return; }
    setResult({ saved, wa, name: f.name.trim().split(" ")[0] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (result && !result.failed) {
    return (
      <div className="wrap section">
        <div className="sent" role="status" style={{ maxWidth: 640 }}>
          <h1 className="h1">{result.saved ? `Thank you, ${result.name}. Your brief is with us.` : "One more step"}</h1>
          <p className="lead" style={{ marginTop: 18 }}>
            {result.saved
              ? "We'll read it, then come back to you with questions, a first drawing and a price."
              : "Send your brief to us on WhatsApp so it reaches the workshop."}
          </p>
          <div className="btn-row">
            {result.wa && <a className="btn btn--wa" href={result.wa} target="_blank" rel="noreferrer"><WhatsAppIcon /> {result.saved ? "Send photos or sketches on WhatsApp" : "Send on WhatsApp"}</a>}
            <Link className="btn btn--ghost" to="/collection">Back to the collection</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <header className="page-head">
        <h1 className="h1">Tell us what to build.</h1>
        <p className="lead">Answer what you can and skip what you can't. We'll work out the rest together, then send you a drawing and a price before anything is cut.</p>
      </header>

      <form className="brief" onSubmit={submit} noValidate>
        <div>
          <section className="brief__q" id="q-type">
            <h2>What are we making?</h2>
            <p>{from ? `Starting from the ${from}. Choose a type only if you want something different.` : "Pick the closest one."}</p>
            <Chips label="Kind of piece" options={TYPES.map((t) => t.key)} value={f.type} onChange={set("type")} />
            {f.type === "Something else" && (
              <label className="field" style={{ marginTop: 14 }}>
                <span>What is it?</span>
                <input className="input" value={f.other} onChange={set("other")} placeholder="A window seat, a bar, a reception desk…" />
              </label>
            )}
            {errors.type && <p className="error" style={{ marginTop: 10 }}>{errors.type}</p>}
          </section>

          <section className="brief__q">
            <h2>How big?</h2>
            <p>In centimetres. Rough numbers are fine, and you can leave this blank if you'd like us to measure.</p>
            <div className="dims-in">
              {[["w", "Width"], ["d", "Depth"], ["h", "Height"]].map(([k, label]) => (
                <label className="field" key={k}>
                  <span>{label}</span>
                  <input className="input" type="number" inputMode="numeric" min="1" max="1500" value={f[k]} onChange={set(k)} placeholder={String(base[["w", "d", "h"].indexOf(k)])} />
                </label>
              ))}
            </div>
          </section>

          <section className="brief__q">
            <h2>Which wood?</h2>
            <p>You can see and compare samples with us before deciding.</p>
            <Chips label="Wood" options={WOOD_CHOICES} value={f.wood} onChange={set("wood")} />
          </section>

          {(!type || type.soft) && (
            <section className="brief__q">
              <h2>Any upholstery?</h2>
              <p>For sofas, beds, benches and anything with a cushion.</p>
              <Chips label="Upholstery" options={FABRICS} value={f.fabric} onChange={set("fabric")} />
            </section>
          )}

          <section className="brief__q">
            <h2>A budget in mind?</h2>
            <p>It helps us suggest the right wood and construction. Skip it if you'd rather see a price first.</p>
            <Chips label="Budget" options={BUDGETS} value={f.budget} onChange={set("budget")} />
          </section>

          <section className="brief__q">
            <h2>Describe it in your own words</h2>
            <p>Where it goes, what it has to hold, something you've seen and liked. You can send photos and sketches on WhatsApp after this step.</p>
            <textarea className="textarea" value={f.message} onChange={set("message")} aria-label="Describe the piece" />
          </section>

          <section className="brief__q" id="q-contact">
            <h2>Where do we reach you?</h2>
            <p>We reply on WhatsApp or by phone.</p>
            <div className="form">
              <div className="form__row">
                <label className="field">
                  <span>Your name</span>
                  <input className="input" value={f.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} />
                  {errors.name && <span className="error">{errors.name}</span>}
                </label>
                <label className="field">
                  <span>Phone or WhatsApp</span>
                  <input className="input" type="tel" inputMode="tel" placeholder="+961" value={f.phone} onChange={set("phone")} autoComplete="tel" aria-invalid={!!errors.phone} />
                  {errors.phone && <span className="error">{errors.phone}</span>}
                </label>
              </div>
              <label className="field">
                <span>Town or area <em>(optional)</em></span>
                <input className="input" value={f.area} onChange={set("area")} autoComplete="address-level2" />
              </label>
              {result && result.failed && <p className="notice notice--bad" role="alert">We couldn't send your brief just now. Please check your connection and try again.</p>}
              <button className="btn" type="submit" disabled={busy}>{busy ? "Sending…" : "Send my brief"}</button>
            </div>
          </section>
        </div>

        <aside className="sheet-card on-dark" aria-label="Your brief so far">
          <h2>Your brief</h2>
          <IsoBox w={size[0]} d={size[1]} h={size[2]} label="Your piece" />
          {!hasSize && <p className="small" style={{ color: "rgba(244,241,237,.6)" }}>{type ? `A typical ${type.key.toLowerCase()} is shown.` : "A typical size is shown."} Enter your own to see it change.</p>}
          <dl>
            <div><dt>Piece</dt><dd>{typeText || (from ? `Based on ${from}` : "Not chosen yet")}</dd></div>
            <div><dt>Size</dt><dd>{hasSize ? `${f.w || "?"} × ${f.d || "?"} × ${f.h || "?"} cm` : "To be measured"}</dd></div>
            <div><dt>Wood</dt><dd>{f.wood || "To be decided"}</dd></div>
            {(!type || type.soft) && <div><dt>Upholstery</dt><dd>{f.fabric || "To be decided"}</dd></div>}
            {f.budget && <div><dt>Budget</dt><dd>{f.budget}</dd></div>}
          </dl>
        </aside>
      </form>
    </div>
  );
}

/* ================================================================== Workshop */

export function Workshop() {
  useTitle("The workshop");
  const { settings } = useShop();
  const place = usePlace();
  const openQuote = useQuote();
  const wa = waLink(settings.whatsapp, "Hello IDEA, I'd like to arrange a visit.");
  return (
    <>
      <div className="wrap">
        <header className="page-head">
          <h1 className="h1" style={{ maxWidth: "14em" }}>One workshop. One piece at a time.</h1>
        </header>
      </div>
      <div className="banner">
        <img src="/hero-workshop.jpg" alt="A finished sofa among timber and tools on the workshop floor" loading="lazy" />
      </div>

      <section className="section">
        <div className="wrap split split--top">
          <p className="statement">We don't hold stock. Nothing here is waiting in a warehouse for a buyer.</p>
          <div className="prose">
            <p>IDEA is a furniture workshop in {place}. Each piece is drawn, cut, joined, finished and upholstered for the person who ordered it, and only after they've approved the drawing.</p>
            <p>That is why a sofa can be made twelve centimetres narrower to clear your doorway, a wardrobe can run wall to wall and floor to ceiling, and a dining table can be sized for the family you actually have.</p>
            <p>The collection on this site is a starting point. Order a piece as it is, change it, or bring us something that isn't here at all.</p>
            <p><Link className="link" to="/bespoke">Start a bespoke brief</Link></p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <div className="section__head"><h2 className="h2">What you can count on</h2></div>
          <ul className="promise">
            <li><h3>Your measurements</h3><p>We build to the centimetre. If the piece has to fit an alcove, a slope or a stair, it will.</p></li>
            <li><h3>Your materials</h3><p>You choose the wood, the finish and the fabric from real samples, not from a screen.</p></li>
            <li><h3>Agreed before we cut</h3><p>You see the drawing and the price first. We start building when you say yes.</p></li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <div>
              <h2 className="h2">The wood</h2>
              <p className="lead">We work in solid timber. These are the four finishes we use most.</p>
            </div>
          </div>
          <div className="woods">
            {WOODS.map((w) => (
              <div className="wood" key={w.key}><Pic src={w.img} alt={`${w.key} grain`} /><h3>{w.key}</h3><p>{w.text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark on-dark">
        <div className="wrap closing">
          <h2 className="h1">Come and choose in person.</h2>
          <div>
            <p className="lead">Our studio is set up for decisions: wood, fabric, foam and paint samples laid out so you can see and touch what your piece will be made from.</p>
            {settings.address && <p style={{ marginTop: 16 }}>{settings.address}{settings.hours ? `. ${settings.hours}` : ""}</p>}
            <div className="btn-row" style={{ marginTop: 26 }}>
              {wa ? <a className="btn btn--light" href={wa} target="_blank" rel="noreferrer"><WhatsAppIcon /> Arrange a visit</a>
                : <button className="btn btn--light" onClick={() => openQuote({})}>Arrange a visit</button>}
              {settings.mapsUrl && <a className="btn btn--ghost-light" href={settings.mapsUrl} target="_blank" rel="noreferrer">Open in Maps</a>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* =================================================================== Contact */

export function Contact() {
  useTitle("Contact");
  const { settings } = useShop();
  const wa = waLink(settings.whatsapp, "Hello IDEA, I have a question about a piece of furniture.");
  const ig = settings.instagram ? (/^https?:/.test(settings.instagram) ? settings.instagram : `https://instagram.com/${settings.instagram.replace(/^@/, "")}`) : null;
  const rows = [
    wa && ["WhatsApp", <a href={wa} target="_blank" rel="noreferrer">Message us</a>],
    settings.phone && ["Phone", <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}>{settings.phone}</a>],
    settings.email && ["Email", <a href={`mailto:${settings.email}`}>{settings.email}</a>],
    settings.address && ["Studio", <>{settings.address}{settings.mapsUrl && <> <a href={settings.mapsUrl} target="_blank" rel="noreferrer">Open in Maps</a></>}</>],
    settings.hours && ["Hours", settings.hours],
    ig && ["Instagram", <a href={ig} target="_blank" rel="noreferrer">@{settings.instagram.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")}</a>],
  ].filter(Boolean);
  return (
    <div className="wrap">
      <header className="page-head">
        <h1 className="h1">Talk to the workshop.</h1>
        <p className="lead">Ask about a piece, a price, or something you'd like made. We usually reply within one working day.</p>
      </header>
      <div className="split split--top" style={{ paddingBottom: "clamp(56px, 8vw, 110px)" }}>
        <div>
          {rows.length > 0 ? (
            <dl className="contact-list">
              {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          ) : (
            <p className="muted">Leave your number and a few words about what you need. We'll get back to you.</p>
          )}
          {wa && <a className="btn btn--wa" style={{ marginTop: 26 }} href={wa} target="_blank" rel="noreferrer"><WhatsAppIcon /> Chat on WhatsApp</a>}
        </div>
        <div className="panel" style={{ background: "var(--white)" }}>
          <h2 className="h3" style={{ fontFamily: "var(--serif)", fontWeight: 400, marginBottom: 18 }}>Send a message</h2>
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}

/* ================================================================= Not found */

export function NotFound({ what = "page" }) {
  useTitle("Not found");
  return (
    <div className="wrap section">
      <h1 className="h1">We couldn't find that {what}.</h1>
      <p className="lead" style={{ marginTop: 16 }}>It may have been renamed or removed from the collection.</p>
      <div className="btn-row" style={{ marginTop: 28 }}>
        <Link className="btn" to="/collection">See the collection</Link>
        <Link className="btn btn--ghost" to="/">Go to the home page</Link>
      </div>
    </div>
  );
}
