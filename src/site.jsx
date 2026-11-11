import React, { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useShop, money, waLink, photoFor, badgeFor, sendRequest, requestText, digits } from "./data";

/* --------------------------------------------------------------------- icons */

export const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="icon" aria-hidden="true" {...props}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.27-.2-.57-.34zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41z" />
  </svg>
);
export const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="icon" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
);
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" className="icon" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
);

/* --------------------------------------------------------------------- hooks */

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — IDEA Furniture` : "IDEA — Solid-wood furniture, made to measure in Lebanon";
  }, [title]);
}

/** Close on Escape, lock page scroll, and put focus inside while a layer is open. */
export function useLayer(onClose) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const el = ref.current;
    if (el) {
      const first = el.querySelector("[data-autofocus]") || el.querySelector("input, textarea, select, button, a[href]");
      if (first) first.focus({ preventScroll: true });
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (prev && prev.focus) prev.focus({ preventScroll: true });
    };
  }, [onClose]);
  return ref;
}

/* ------------------------------------------------------------------- picture */

export function Pic({ src, alt = "", eager = false, className = "", sizes, children }) {
  const [state, setState] = useState("loading");
  useEffect(() => setState("loading"), [src]);
  if (!src || state === "error") {
    return <span className={`pic pic--empty ${className}`}>{children}<span>Photo coming soon</span></span>;
  }
  return (
    <span className={`pic ${className}`}>
      {children}
      <img
        src={src} alt={alt} sizes={sizes}
        loading={eager ? "eager" : "lazy"} decoding="async"
        className={state === "in" ? "is-in" : ""}
        ref={(el) => { if (el && el.complete && el.naturalWidth && state === "loading") setState("in"); }}
        onLoad={() => setState("in")} onError={() => setState("error")}
      />
    </span>
  );
}

export function ProductCard({ p, eager }) {
  const badge = badgeFor(p.tag);
  return (
    <Link to={`/piece/${p.slug}`} className="card">
      <Pic src={photoFor(p)} alt={`${p.name}, ${p.mat}`} eager={eager}>
        {badge && <span className="badge">{badge}</span>}
      </Pic>
      <div className="card__meta">
        <span className="card__name">{p.name}</span>
        {p.price > 0 && <span className="card__price">From {money(p.price)}</span>}
      </div>
      <div className="card__sub">
        <span>{p.mat}</span>
        {p.colors.length > 1 && (
          <span className="dots" aria-label={`${p.colors.length} finishes`}>
            {p.colors.slice(0, 5).map((c, i) => <i key={i} style={{ background: c.h }} />)}
          </span>
        )}
      </div>
    </Link>
  );
}

export const CardSkeletons = ({ n = 6 }) => (
  <div className="grid skeleton" aria-hidden="true">
    {Array.from({ length: n }).map((_, i) => (
      <div key={i}><span className="pic" /><div className="bar" /></div>
    ))}
  </div>
);

/* ---------------------------------------------------------- measured drawing */
/* An isometric outline of a piece with its three dimensions called out, the way
   a workshop drawing does. Used on every piece and in the bespoke brief. */

function useTween(target, ms = 650) {
  const [val, setVal] = useState(target);
  const from = useRef(target);
  const cur = useRef(target);
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { cur.current = target; setVal(target); return; }
    from.current = cur.current;
    const start = performance.now();
    let raf;
    const step = (now) => {
      const t = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - t, 3);
      const next = from.current.map((a, i) => a + (target[i] - a) * e);
      cur.current = next; setVal(next);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target[0], target[1], target[2], ms]);
  return val;
}

export function IsoBox({ w, d, h, label }) {
  const safe = [Math.max(10, Number(w) || 0), Math.max(10, Number(d) || 0), Math.max(10, Number(h) || 0)];
  const [tw, td, th] = useTween(safe);
  const VW = 440, VH = 320, M = 58;
  const C = 0.866, S = 0.5;
  const scale = Math.min((VW - 2 * M) / (C * (tw + td)), (VH - 2 * M) / (S * (tw + td) + th));
  const W = tw * scale, D = td * scale, H = th * scale;
  const ox = M + C * D + ((VW - 2 * M) - C * (W + D)) / 2;
  const oy = VH - M - ((VH - 2 * M) - (S * (W + D) + H)) / 2;
  const P = (x, y, z) => [ox + C * x - C * y, oy - S * x - S * y - z];
  const pt = (a) => a.map((n) => n.toFixed(1)).join(",");
  const O = P(0, 0, 0), X = P(W, 0, 0), Y = P(0, D, 0), XY = P(W, D, 0);
  const Oz = P(0, 0, H), Xz = P(W, 0, H), Yz = P(0, D, H), XYz = P(W, D, H);
  const off = 18;
  const wA = [O[0] + S * off, O[1] + C * off], wB = [X[0] + S * off, X[1] + C * off];
  const dA = [O[0] - S * off, O[1] + C * off], dB = [Y[0] - S * off, Y[1] + C * off];
  const hA = [Y[0] - off, Y[1]], hB = [Yz[0] - off, Yz[1]];
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const r = (n) => Math.round(n);
  const tick = (p, dx, dy) => `M${(p[0] - dx).toFixed(1)},${(p[1] - dy).toFixed(1)}L${(p[0] + dx).toFixed(1)},${(p[1] + dy).toFixed(1)}`;
  return (
    <svg className="iso" viewBox={`0 0 ${VW} ${VH}`} role="img"
      aria-label={`${label ? label + ": " : ""}${r(safe[0])} cm wide, ${r(safe[1])} cm deep, ${r(safe[2])} cm high`}>
      <polygon className="face" points={[Oz, Xz, XYz, Yz].map(pt).join(" ")} />
      <path className="hidden-edge" d={`M${pt(XY)}L${pt(X)}M${pt(XY)}L${pt(Y)}M${pt(XY)}L${pt(XYz)}`} />
      <path className="edge" d={`M${pt(O)}L${pt(X)}L${pt(Xz)}L${pt(Oz)}ZM${pt(O)}L${pt(Y)}L${pt(Yz)}L${pt(Oz)}M${pt(Yz)}L${pt(XYz)}L${pt(Xz)}`} />
      <path className="dim" d={`M${pt(wA)}L${pt(wB)}${tick(wA, 4, -7)}${tick(wB, 4, -7)}M${pt(dA)}L${pt(dB)}${tick(dA, 4, 7)}${tick(dB, 4, 7)}M${pt(hA)}L${pt(hB)}${tick(hA, 5, 0)}${tick(hB, 5, 0)}`} />
      <text x={mid(wA, wB)[0] + 8} y={mid(wA, wB)[1] + 18} textAnchor="start">{r(tw)} cm</text>
      <text x={mid(dA, dB)[0] - 8} y={mid(dA, dB)[1] + 18} textAnchor="end">{r(td)} cm</text>
      <text x={hA[0] - 10} y={mid(hA, hB)[1] + 4} textAnchor="end">{r(th)} cm</text>
    </svg>
  );
}

/* -------------------------------------------------------------- quote dialog */

const QuoteCtx = createContext(() => {});
export const useQuote = () => useContext(QuoteCtx);

const validPhone = (s) => digits(s).length >= 7;

export function QuoteForm({ context = {}, onDone, compact }) {
  const { settings } = useShop();
  const [f, setF] = useState({ name: "", phone: "", area: "", message: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = "Please tell us your name.";
    if (!validPhone(f.phone)) er.phone = "Please enter a phone number we can reach you on.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    const req = { kind: context.piece ? "quote" : "question", ...context, ...f };
    const { saved } = await sendRequest(req);
    const wa = waLink(settings.whatsapp, requestText(req));
    setBusy(false);
    if (!saved && !wa) { setResult({ failed: true }); return; }
    setResult({ saved, wa, name: f.name.trim().split(" ")[0] });
    if (onDone) onDone();
  };

  if (result && !result.failed) {
    return (
      <div className="sent" role="status">
        <h2 className="h2">{result.saved ? `Thank you, ${result.name}.` : "One more step"}</h2>
        <p className="muted">
          {result.saved
            ? "Your request is with us. We'll reply on the number you gave, usually within one working day."
            : "Send your request to us on WhatsApp so it reaches the workshop."}
        </p>
        {result.wa && (
          <div className="btn-row">
            <a className="btn btn--wa" href={result.wa} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> {result.saved ? "Continue on WhatsApp" : "Send on WhatsApp"}
            </a>
          </div>
        )}
        {result.saved && result.wa && <p className="form__note" style={{ marginTop: 14 }}>WhatsApp is quickest if you have photos or measurements to share.</p>}
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className={compact ? "form" : "form__row"}>
        <label className="field">
          <span>Your name</span>
          <input className="input" data-autofocus value={f.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} />
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
      <label className="field">
        <span>{context.piece ? "Anything we should know?" : "How can we help?"} <em>(optional)</em></span>
        <textarea className="textarea" value={f.message} onChange={set("message")}
          placeholder={context.piece ? "Room size, a different wood or fabric, when you need it…" : "Tell us what you have in mind."} />
      </label>
      {result && result.failed && (
        <p className="notice notice--bad" role="alert">We couldn't send your request just now. Please check your connection and try again.</p>
      )}
      <button className="btn btn--block" type="submit" disabled={busy}>{busy ? "Sending…" : "Send request"}</button>
      <p className="form__note">We only use your number to reply to this request.</p>
    </form>
  );
}

function QuoteSheet({ context, onClose }) {
  const ref = useLayer(onClose);
  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="quote-title" ref={ref}>
        <div className="sheet__top">
          <div>
            <h2 className="h2" id="quote-title">Request a quote</h2>
            <p className="muted" style={{ marginTop: 6 }}>Tell us where to reach you and we'll come back with a price and a lead time.</p>
          </div>
          <button className="close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        {context.piece && (
          <div className="sheet__piece">
            <Pic src={context.photo} alt="" />
            <div>
              <b style={{ fontWeight: 500 }}>{context.piece}</b>
              <div className="muted">{[context.finish, context.size].filter(Boolean).join(", ")}</div>
            </div>
          </div>
        )}
        <QuoteForm compact context={{ piece: context.piece, finish: context.finish, size: context.size }} />
      </div>
    </div>
  );
}

export function QuoteProvider({ children }) {
  const [ctx, setCtx] = useState(null);
  const open = useCallback((context = {}) => setCtx(context), []);
  const close = useCallback(() => setCtx(null), []);
  return (
    <QuoteCtx.Provider value={open}>
      {children}
      {ctx && <QuoteSheet context={ctx} onClose={close} />}
    </QuoteCtx.Provider>
  );
}

/* ------------------------------------------------------------------ lightbox */

export function Lightbox({ src, alt, onClose }) {
  const ref = useLayer(onClose);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose} ref={ref}>
      <img src={src} alt={alt} />
      <button aria-label="Close" onClick={onClose}><CloseIcon /></button>
    </div>
  );
}

/* -------------------------------------------------------------------- layout */

const NAV = [
  ["/collection", "Collection"],
  ["/bespoke", "Bespoke"],
  ["/workshop", "Workshop"],
  ["/contact", "Contact"],
];

function MobileMenu({ onClose }) {
  const { settings } = useShop();
  const openQuote = useQuote();
  const ref = useLayer(onClose);
  const wa = waLink(settings.whatsapp, "Hello IDEA, I have a question about a piece of furniture.");
  return (
    <div className="mobile-menu on-dark" role="dialog" aria-modal="true" aria-label="Menu" ref={ref}>
      <div className="mobile-menu__top">
        <Link to="/" className="wordmark" onClick={onClose}>IDEA<span>.</span></Link>
        <button className="menu-btn" style={{ display: "flex" }} onClick={onClose} aria-label="Close menu"><CloseIcon /></button>
      </div>
      <nav>
        {NAV.map(([to, label]) => <Link key={to} to={to} onClick={onClose}>{label}</Link>)}
      </nav>
      <div className="mobile-menu__foot">
        <button className="btn btn--light btn--block" onClick={() => { onClose(); openQuote({}); }}>Request a quote</button>
        {wa && <a className="btn btn--ghost-light btn--block" href={wa} target="_blank" rel="noreferrer"><WhatsAppIcon /> Message us on WhatsApp</a>}
      </div>
    </div>
  );
}

export function Header() {
  const { pathname } = useLocation();
  const openQuote = useQuote();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const closeMenu = useCallback(() => setMenu(false), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const over = pathname === "/" && !scrolled;
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={`header${over ? " header--over" : ""}`}>
        <div className="wrap header__in">
          <Link to="/" className="wordmark" aria-label="IDEA, home">IDEA<span>.</span></Link>
          <nav className="nav" aria-label="Main">
            {NAV.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
          </nav>
          <div className="header__right">
            <button className="btn btn--small" onClick={() => openQuote({})}>Request a quote</button>
            <button className="menu-btn" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu}><MenuIcon /></button>
          </div>
        </div>
      </header>
      {menu && <MobileMenu onClose={closeMenu} />}
    </>
  );
}

const social = (handle, base) => {
  const h = String(handle || "").trim();
  if (!h) return null;
  return /^https?:/.test(h) ? h : base + h.replace(/^@/, "");
};

export function Footer() {
  const { settings, categories } = useShop();
  const place = settings.city ? `${settings.city}, Lebanon` : "Lebanon";
  const links = [
    ["Instagram", social(settings.instagram, "https://instagram.com/")],
    ["Facebook", social(settings.facebook, "https://facebook.com/")],
    ["TikTok", social(settings.tiktok, "https://tiktok.com/@")],
  ].filter((l) => l[1]);
  const wa = waLink(settings.whatsapp);
  return (
    <footer className="footer on-dark">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <Link to="/" className="wordmark">IDEA<span>.</span></Link>
            <p className="footer__blurb">Solid-wood furniture, designed with you and built to your measurements in our own workshop in {place}.</p>
          </div>
          <div>
            <h2>Collection</h2>
            <ul>
              {categories.map((c) => <li key={c}><Link to={`/collection?room=${encodeURIComponent(c)}`}>{c}</Link></li>)}
              <li><Link to="/collection">All pieces</Link></li>
            </ul>
          </div>
          <div>
            <h2>IDEA</h2>
            <ul>
              <li><Link to="/bespoke">Bespoke pieces</Link></li>
              <li><Link to="/workshop">The workshop</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h2>Get in touch</h2>
            <ul>
              {wa && <li><a href={wa} target="_blank" rel="noreferrer">WhatsApp</a></li>}
              {settings.phone && <li><a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}>{settings.phone}</a></li>}
              {settings.email && <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>}
              {settings.address && <li>{settings.address}</li>}
              {links.map(([label, href]) => <li key={label}><a href={href} target="_blank" rel="noreferrer">{label}</a></li>)}
              {!wa && !settings.phone && !settings.email && <li><Link to="/contact">Send us a message</Link></li>}
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} IDEA Furniture</span>
          <span>Made to order in {place}</span>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  const { settings } = useShop();
  const wa = waLink(settings.whatsapp, "Hello IDEA, I have a question about a piece of furniture.");
  if (!wa) return null;
  return (
    <a className="wa-fab" href={wa} target="_blank" rel="noreferrer" aria-label="Message IDEA on WhatsApp">
      <WhatsAppIcon />
    </a>
  );
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
