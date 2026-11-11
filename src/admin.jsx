import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, productToRow, IMAGE_BUCKET } from "./supabaseClient";
import { useShop, CATALOG, CATEGORY_ORDER, DEFAULT_SETTINGS, money, slugify, digits, parseDims, formatDims, photoFor } from "./data";
import { Pic, CloseIcon, WhatsAppIcon, useLayer, useTitle } from "./site";

const STATUSES = ["New", "In progress", "Quoted", "Won", "Closed"];
const TAGS = [["", "No badge"], ["New", "New"], ["Signature", "Signature"]];

/** 70 123 456 / 03 123456 / 0096170123456 -> 96170123456 for wa.me */
const toIntl = (phone) => {
  let d = digits(phone);
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("961")) return d;
  if (d.startsWith("0")) d = d.slice(1);
  return d.length <= 8 ? "961" + d : d;
};

const when = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + ", " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

/* ---------------------------------------------------------------- uploading */

function compress(file, max = 1600) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      const g = c.getContext("2d");
      g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
      g.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not read that image."))), "image/jpeg", 0.84);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That file isn't an image we can read.")); };
    img.src = url;
  });
}

async function uploadPhoto(file) {
  const blob = await compress(file);
  const name = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, "")) || "photo"}.jpg`;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(name, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
  if (error) throw new Error(/bucket/i.test(error.message) ? "Photo storage isn't set up yet. Run supabase/setup.sql first." : error.message);
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(name).data.publicUrl;
}

function PhotoField({ value, onChange, label = "Photo", onError }) {
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try { onChange(await uploadPhoto(file)); } catch (err) { onError(err.message); }
    setBusy(false);
  };
  return (
    <div className="field">
      <span>{label}</span>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="input" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="Upload, or paste a link" />
        <label className="btn btn--ghost" style={{ whiteSpace: "nowrap", cursor: "pointer" }}>
          {busy ? "Uploading…" : "Upload"}
          <input type="file" accept="image/*" className="sr-only" onChange={pick} disabled={busy} />
        </label>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- login */

function Login({ notice }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) setError(/invalid/i.test(err.message) ? "That email and password don't match." : "Couldn't sign in: " + err.message);
  };
  return (
    <div className="login">
      <form className="login__card form" onSubmit={submit}>
        <div>
          <div className="wordmark">IDEA<span>.</span></div>
          <p className="muted" style={{ marginTop: 6 }}>Sign in to manage the shop.</p>
        </div>
        {notice && <p className="notice notice--bad">{notice}</p>}
        <label className="field"><span>Email</span>
          <input className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="field"><span>Password</span>
          <input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn--block" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        <Link className="link small" to="/">Back to the website</Link>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ overview */

function Overview({ requests, requestsOk, go }) {
  const { products, settings, source } = useShop();
  const noPhoto = products.filter((p) => !photoFor(p));
  const fresh = requests.filter((r) => r.status === "New");
  const open = requests.filter((r) => r.status === "In progress" || r.status === "Quoted");
  const todo = [
    [source === "live", "Database is connected", "The shop is reading from your Supabase database."],
    [requestsOk, "Database setup has been run", "Run supabase/setup.sql in Supabase so requests, settings and photo uploads work."],
    [digits(settings.whatsapp).length >= 8, "WhatsApp number added", "Customers can't message you until you add it in Settings."],
    [!!(settings.address || settings.city), "Studio location added", "Shown on the Contact and Workshop pages."],
    [noPhoto.length === 0, "Every piece has a photo", `${noPhoto.length} ${noPhoto.length === 1 ? "piece has" : "pieces have"} no photo and ${noPhoto.length === 1 ? "is" : "are"} hidden from the site: ${noPhoto.map((p) => p.name).join(", ")}.`],
  ];
  return (
    <>
      <div className="admin__head"><h1>Overview</h1><Link className="btn btn--ghost btn--small" to="/">View the website</Link></div>
      <div className="tiles">
        <button className="tile" style={{ textAlign: "left" }} onClick={() => go("requests")}><b>{fresh.length}</b><span>New requests</span></button>
        <div className="tile"><b>{open.length}</b><span>In progress or quoted</span></div>
        <div className="tile"><b>{products.length - noPhoto.length}</b><span>Pieces on the site</span></div>
        <div className="tile"><b>{requests.length}</b><span>Requests in total</span></div>
      </div>
      <div className="two">
        <div className="panel">
          <h2>Latest requests</h2>
          {requests.length === 0 ? <p className="muted">No requests yet. They appear here as soon as a customer sends one from the site.</p> : (
            <div className="rows">
              {requests.slice(0, 6).map((r) => (
                <button className="row" key={r.id} onClick={() => go("requests", r.id)}>
                  <span style={{ minWidth: 0 }}><b>{r.name}</b><p>{r.piece || (r.details && r.details.type) || "General question"} · {when(r.created_at)}</p></span>
                  <span className={`status status--${r.status.replace(/\s/g, "-")}`}>{r.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="panel">
          <h2>Launch checklist</h2>
          <ul className="todo">
            {todo.map(([done, title, help]) => (
              <li key={title} className={done ? "is-done" : ""}>
                <span className="mark" aria-hidden="true">{done ? "✓" : ""}</span>
                <span><b style={{ fontWeight: 500 }}>{title}</b>{!done && <span className="muted small" style={{ display: "block" }}>{help}</span>}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ requests */

function Requests({ requests, requestsOk, reload, selectedId, select, say }) {
  const { settings } = useShop();
  const [filter, setFilter] = useState("All");
  const [note, setNote] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const list = filter === "All" ? requests : requests.filter((r) => r.status === filter);
  const sel = requests.find((r) => r.id === selectedId) || null;
  useEffect(() => { setNote(sel ? sel.note || "" : ""); setConfirmDelete(false); }, [selectedId]); // eslint-disable-line

  const patch = async (id, values, msg) => {
    const { error } = await supabase.from("requests").update(values).eq("id", id);
    if (error) return say("Couldn't save: " + error.message, true);
    say(msg); reload();
  };
  const remove = async (id) => {
    const { error } = await supabase.from("requests").delete().eq("id", id);
    if (error) return say("Couldn't delete: " + error.message, true);
    select(null); say("Request deleted"); reload();
  };

  if (!requestsOk) {
    return (
      <>
        <div className="admin__head"><h1>Requests</h1></div>
        <p className="notice notice--bad">Requests can't be stored yet. Open Supabase, go to SQL Editor and run the file <b>supabase/setup.sql</b> from the project folder. Until then, quote requests from the website are not saved.</p>
      </>
    );
  }
  const d = sel ? sel.details || {} : {};
  const hello = sel ? `Hello ${sel.name.split(" ")[0]}, this is IDEA Furniture. Thank you for your request${sel.piece ? ` about the ${sel.piece}` : ""}.` : "";
  return (
    <>
      <div className="admin__head">
        <h1>Requests</h1>
        <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
          {["All", ...STATUSES].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="two">
        <div className="panel" style={{ padding: 0 }}>
          {list.length === 0 ? <p className="muted" style={{ padding: 20 }}>{requests.length ? "No requests with this status." : "No requests yet."}</p> : (
            <div className="rows" style={{ borderTop: 0 }}>
              {list.map((r) => (
                <button className="row" key={r.id} aria-current={r.id === selectedId} onClick={() => select(r.id)}>
                  <span style={{ minWidth: 0 }}>
                    <b>{r.name}</b>
                    <p>{r.kind === "bespoke" ? "Bespoke: " : ""}{r.piece || d.type || (r.details && r.details.type) || "General question"} · {when(r.created_at)}</p>
                  </span>
                  <span className={`status status--${r.status.replace(/\s/g, "-")}`}>{r.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {sel && (
          <div className="panel stack">
            <div className="spread">
              <h2 style={{ margin: 0, fontFamily: "var(--serif)", fontWeight: 400, fontSize: "1.4rem" }}>{sel.name}</h2>
              <button className="close" style={{ margin: 0 }} onClick={() => select(null)} aria-label="Close"><CloseIcon /></button>
            </div>
            <dl className="kv">
              <dt>Received</dt><dd>{when(sel.created_at)}</dd>
              <dt>Type</dt><dd>{sel.kind === "bespoke" ? "Bespoke brief" : sel.kind === "quote" ? "Quote for a piece" : "Question"}</dd>
              {sel.piece && <><dt>Piece</dt><dd>{sel.piece}</dd></>}
              {d.type && <><dt>Making</dt><dd>{d.type}</dd></>}
              {(sel.size || d.size) && <><dt>Size</dt><dd>{sel.size || d.size}</dd></>}
              {(sel.finish || d.wood) && <><dt>Finish / wood</dt><dd>{sel.finish || d.wood}</dd></>}
              {d.fabric && <><dt>Upholstery</dt><dd>{d.fabric}</dd></>}
              {d.budget && <><dt>Budget</dt><dd>{d.budget}</dd></>}
              {sel.phone && <><dt>Phone</dt><dd><a className="link" href={`tel:${sel.phone.replace(/[^\d+]/g, "")}`}>{sel.phone}</a></dd></>}
              {sel.email && <><dt>Email</dt><dd><a className="link" href={`mailto:${sel.email}`}>{sel.email}</a></dd></>}
              {sel.area && <><dt>Area</dt><dd>{sel.area}</dd></>}
            </dl>
            {sel.message && <p className="notice" style={{ whiteSpace: "pre-wrap" }}>{sel.message}</p>}
            {sel.phone && (
              <a className="btn btn--wa" href={`https://wa.me/${toIntl(sel.phone)}?text=${encodeURIComponent(hello)}`} target="_blank" rel="noreferrer"><WhatsAppIcon /> Reply on WhatsApp</a>
            )}
            <div>
              <span className="label">Status</span>
              <div className="chips" style={{ marginTop: 8 }}>
                {STATUSES.map((s) => <button key={s} className="chip" aria-pressed={sel.status === s} onClick={() => patch(sel.id, { status: s }, `Marked as ${s}`)}>{s}</button>)}
              </div>
            </div>
            <label className="field"><span>Private note</span>
              <textarea className="textarea" style={{ minHeight: 80 }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Price quoted, visit booked, deposit paid…" />
            </label>
            <div className="spread">
              <button className="btn btn--small" onClick={() => patch(sel.id, { note }, "Note saved")} disabled={note === (sel.note || "")}>Save note</button>
              {confirmDelete
                ? <button className="btn btn--small btn--danger" onClick={() => remove(sel.id)}>Yes, delete this request</button>
                : <button className="btn btn--small btn--danger" onClick={() => setConfirmDelete(true)}>Delete</button>}
            </div>
            {!digits(settings.whatsapp) && <p className="small muted">Tip: add your WhatsApp number in Settings so customers can reach you directly.</p>}
          </div>
        )}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------- pieces */

const blankPiece = () => ({ name: "", cat: "Living Room", mat: "", price: "", tag: "New", desc: "", w: "", d: "", h: "", dimsText: "", sizesText: "", colors: [{ n: "Natural", h: "#8B6F5C", photo: "" }] });

const toForm = (p) => {
  const dm = parseDims(p.dims);
  return {
    name: p.name, cat: p.cat, mat: p.mat, price: p.price || "", tag: /bestseller/i.test(p.tag) ? "Signature" : (TAGS.some((t) => t[0] === p.tag) ? p.tag : ""),
    desc: p.desc, w: dm ? dm.w : "", d: dm ? dm.d : "", h: dm ? dm.h : "", dimsText: dm ? "" : p.dims,
    sizesText: p.sizes.join(", "), colors: p.colors.map((c) => ({ ...c, photo: c.photo || "" })),
  };
};

function PieceEditor({ initial, categories, featured, onClose, onSaved, say }) {
  const ref = useLayer(onClose);
  const [f, setF] = useState(initial ? toForm(initial) : blankPiece());
  const [isFeatured, setIsFeatured] = useState(featured);
  const [busy, setBusy] = useState(false);
  const [openSizes, setOpenSizes] = useState(-1);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e && e.target ? e.target.value : e }));
  const sizes = f.sizesText.split(",").map((s) => s.trim()).filter(Boolean);
  const setColor = (i, patch) => setF((s) => ({ ...s, colors: s.colors.map((c, j) => (j === i ? { ...c, ...patch } : c)) }));
  const bad = (m) => say(m, true);

  const save = async (e) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return bad("Give the piece a name.");
    if (!f.colors.some((c) => c.photo)) return bad("Add at least one photo. Pieces without a photo are not shown on the site.");
    setBusy(true);
    const dims = f.w && f.d && f.h ? formatDims({ w: Number(f.w), d: Number(f.d), h: Number(f.h) }) : f.dimsText || "";
    const row = productToRow({
      name: f.name, cat: f.cat.trim() || "Other", mat: f.mat, price: f.price, tag: f.tag, desc: f.desc, dims, sizes,
      colors: f.colors.filter((c) => c.n.trim() || c.photo).map((c) => {
        const photos = c.photos ? Object.fromEntries(Object.entries(c.photos).filter(([k, v]) => v && sizes.includes(k))) : null;
        return { n: c.n.trim() || "Natural", h: c.h, photo: c.photo || null, ...(photos && Object.keys(photos).length ? { photos } : {}) };
      }),
    });
    const q = initial ? supabase.from("products").update(row).eq("id", initial.id).select("id") : supabase.from("products").insert(row).select("id");
    const { data, error } = await q;
    setBusy(false);
    if (error) return bad("Couldn't save: " + error.message);
    if (!data || data.length === 0) return bad("Nothing was saved. Your account may not have permission to edit pieces.");
    onSaved(row.name, isFeatured, initial ? initial.name : null);
  };

  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form className="modal form" role="dialog" aria-modal="true" aria-label={initial ? "Edit piece" : "Add a piece"} ref={ref} onSubmit={save}>
        <div className="spread">
          <h2 className="h2">{initial ? "Edit piece" : "Add a piece"}</h2>
          <button type="button" className="close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        <div className="form__row">
          <label className="field"><span>Name</span><input className="input" data-autofocus value={f.name} onChange={set("name")} /></label>
          <label className="field"><span>Room</span>
            <input className="input" list="rooms" value={f.cat} onChange={set("cat")} />
            <datalist id="rooms">{[...new Set([...CATEGORY_ORDER, ...categories])].map((c) => <option key={c} value={c} />)}</datalist>
          </label>
        </div>
        <div className="form__row">
          <label className="field"><span>Materials</span><input className="input" value={f.mat} onChange={set("mat")} placeholder="Solid walnut, linen cushion" /></label>
          <div className="form__row">
            <label className="field"><span>Price from (USD)</span><input className="input" type="number" min="0" value={f.price} onChange={set("price")} /></label>
            <label className="field"><span>Badge</span>
              <select className="select" style={{ minHeight: 50 }} value={f.tag} onChange={set("tag")}>{TAGS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            </label>
          </div>
        </div>
        <label className="field"><span>Description</span><textarea className="textarea" value={f.desc} onChange={set("desc")} placeholder="Two or three plain sentences about what it is and how it's made." /></label>
        <div className="form__row">
          <div>
            <span className="label">Size as shown (cm)</span>
            <div className="dims-in" style={{ marginTop: 6 }}>
              {[["w", "Width"], ["d", "Depth"], ["h", "Height"]].map(([k, l]) => <input key={k} className="input" type="number" min="1" aria-label={l} placeholder={l} value={f[k]} onChange={set(k)} />)}
            </div>
          </div>
          <label className="field"><span>Sizes offered <em>(separate with commas)</em></span><input className="input" value={f.sizesText} onChange={set("sizesText")} placeholder="Queen 160 cm, King 180 cm" /></label>
        </div>

        <div>
          <div className="spread" style={{ marginBottom: 10 }}>
            <span className="label">Finishes and photos</span>
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setF((s) => ({ ...s, colors: [...s.colors, { n: "", h: "#8B6F5C", photo: "" }] }))}>Add a finish</button>
          </div>
          <div className="stack">
            {f.colors.map((c, i) => (
              <div className="finish" key={i}>
                <div className="finish__top">
                  <Pic src={c.photo} alt="" />
                  <label className="field"><span>Finish name</span><input className="input" value={c.n} onChange={(e) => setColor(i, { n: e.target.value })} placeholder="Walnut, Sand linen…" /></label>
                  <label className="field"><span>Colour</span><input className="color-in" type="color" value={/^#[0-9a-f]{6}$/i.test(c.h) ? c.h : "#8B6F5C"} onChange={(e) => setColor(i, { h: e.target.value })} /></label>
                  {f.colors.length > 1 && <button type="button" className="btn btn--danger btn--small" onClick={() => setF((s) => ({ ...s, colors: s.colors.filter((_, j) => j !== i) }))}>Remove</button>}
                </div>
                <PhotoField value={c.photo} onChange={(v) => setColor(i, { photo: v })} onError={bad} />
                {sizes.length > 1 && (
                  <>
                    <button type="button" className="link small" style={{ justifySelf: "start" }} onClick={() => setOpenSizes(openSizes === i ? -1 : i)}>
                      {openSizes === i ? "Hide photos per size" : "Different photo for each size"}
                    </button>
                    {openSizes === i && sizes.map((s) => (
                      <PhotoField key={s} label={s} value={(c.photos && c.photos[s]) || ""} onError={bad}
                        onChange={(v) => setColor(i, { photos: { ...(c.photos || {}), [s]: v } })} />
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} style={{ width: 18, height: 18 }} />
          <span>Feature this piece on the home page</span>
        </label>
        <div className="btn-row">
          <button className="btn" disabled={busy}>{busy ? "Saving…" : initial ? "Save changes" : "Add to the collection"}</button>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Pieces({ say, saveSettings }) {
  const { products, categories, settings, refreshProducts, source } = useShop();
  const [editing, setEditing] = useState(undefined); // undefined closed · null new · product edit
  const [confirmId, setConfirmId] = useState(null);
  const [busy, setBusy] = useState("");
  const featured = Array.isArray(settings.featured) ? settings.featured : [];
  const closeEditor = useCallback(() => setEditing(undefined), []);
  const stale = products.filter((p) => { const c = CATALOG.find((x) => x.name === p.name); return c && c.desc !== p.desc; }).length;

  const onSaved = async (name, isFeatured, oldName) => {
    setEditing(undefined);
    await refreshProducts();
    const without = featured.filter((n) => n !== name && n !== oldName);
    const next = isFeatured ? [...without, name] : without;
    if (next.join("|") !== featured.join("|")) await saveSettings({ ...settings, featured: next }, true);
    say("Saved. It's live on the site.");
  };
  const remove = async (p) => {
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return say("Couldn't delete: " + error.message, true);
    setConfirmId(null); await refreshProducts(); say(`${p.name} deleted`);
  };
  const importAll = async () => {
    setBusy("import");
    const { error } = await supabase.from("products").insert(CATALOG.map(productToRow));
    setBusy("");
    if (error) return say("Couldn't import: " + error.message, true);
    await refreshProducts(); say("Starter catalogue imported");
  };
  const refreshWording = async () => {
    setBusy("wording");
    let n = 0, failed = "";
    for (const p of products) {
      const c = CATALOG.find((x) => x.name === p.name);
      if (!c || c.desc === p.desc) continue;
      const row = productToRow({ ...c, price: p.price || c.price });
      const { error } = await supabase.from("products").update({ description: row.description, material: row.material, tag: row.tag, sizes: row.sizes, colors: row.colors, image_url: row.image_url }).eq("id", p.id);
      if (error) { failed = error.message; break; }
      n += 1;
    }
    setBusy("");
    await refreshProducts();
    say(failed ? "Stopped: " + failed : `Updated the wording on ${n} pieces. Prices were not changed.`, !!failed);
  };

  return (
    <>
      <div className="admin__head">
        <div><h1>Pieces</h1><p className="muted">{products.length} in the database</p></div>
        <div className="btn-row">
          {source === "live" && products.length === 0 && <button className="btn btn--ghost" onClick={importAll} disabled={!!busy}>{busy === "import" ? "Importing…" : "Import starter catalogue"}</button>}
          <button className="btn" onClick={() => setEditing(null)}>Add a piece</button>
        </div>
      </div>
      {source !== "live" && <p className="notice notice--bad" style={{ marginBottom: 18 }}>The database can't be reached right now, so this is the built-in catalogue and changes can't be saved. If your Supabase project is paused, open supabase.com and press Restore.</p>}
      {source === "live" && stale > 0 && (
        <div className="notice spread" style={{ marginBottom: 18 }}>
          <span>{stale} {stale === 1 ? "piece still has" : "pieces still have"} the old descriptions. The new site comes with rewritten ones.</span>
          <button className="btn btn--small" onClick={refreshWording} disabled={!!busy}>{busy === "wording" ? "Updating…" : "Use the new descriptions"}</button>
        </div>
      )}
      <div className="agrid">
        {products.map((p) => (
          <div className="acard" key={p.id}>
            <Pic src={photoFor(p)} alt="" />
            <div className="acard__body">
              <b>{p.name}</b>
              <span>{p.cat}{p.price ? ` · from ${money(p.price)}` : ""}</span>
              {!photoFor(p) && <span className="warn">No photo, so it's hidden from the site</span>}
              {featured.includes(p.name) && <span>On the home page</span>}
            </div>
            <div className="acard__actions">
              <button className="btn btn--ghost btn--small" onClick={() => setEditing(p)} disabled={source !== "live"}>Edit</button>
              {confirmId === p.id
                ? <button className="btn btn--danger btn--small" onClick={() => remove(p)}>Yes, delete</button>
                : <button className="btn btn--danger btn--small" onClick={() => setConfirmId(p.id)} disabled={source !== "live"}>Delete</button>}
            </div>
          </div>
        ))}
      </div>
      {editing !== undefined && (
        <PieceEditor initial={editing} categories={categories} featured={editing ? featured.includes(editing.name) : false} onClose={closeEditor} onSaved={onSaved} say={say} />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ settings */

function Settings({ saveSettings }) {
  const { settings, settingsLive } = useShop();
  const [f, setF] = useState({ ...DEFAULT_SETTINGS, ...settings });
  const [busy, setBusy] = useState(false);
  useEffect(() => { setF({ ...DEFAULT_SETTINGS, ...settings }); }, [settings]);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const voices = Array.isArray(f.testimonials) ? f.testimonials : [];
  const setVoice = (i, patch) => setF((s) => ({ ...s, testimonials: voices.map((v, j) => (j === i ? { ...v, ...patch } : v)) }));
  const save = async (e) => { e.preventDefault(); setBusy(true); await saveSettings({ ...f, testimonials: voices.filter((v) => v.text && v.name) }); setBusy(false); };
  const field = (k, label, props = {}) => (
    <label className="field"><span>{label}</span><input className="input" value={f[k] || ""} onChange={set(k)} {...props} /></label>
  );
  return (
    <form onSubmit={save}>
      <div className="admin__head"><h1>Settings</h1><button className="btn" disabled={busy}>{busy ? "Saving…" : "Save settings"}</button></div>
      {!settingsLive && <p className="notice notice--bad" style={{ marginBottom: 18 }}>Settings can't be saved until the database setup has been run (supabase/setup.sql).</p>}
      <div className="panel form">
        <h2>How customers reach you</h2>
        <div className="form__row">
          {field("whatsapp", "WhatsApp number, with country code", { placeholder: "+961 70 123 456", inputMode: "tel" })}
          {field("phone", "Phone number shown on the site", { placeholder: "+961 1 234 567", inputMode: "tel" })}
        </div>
        <div className="form__row">
          {field("email", "Email", { type: "email", placeholder: "hello@yourdomain.com" })}
          {field("instagram", "Instagram", { placeholder: "@ideafurniture" })}
        </div>
        <div className="form__row">
          {field("facebook", "Facebook page", { placeholder: "ideafurniture" })}
          {field("tiktok", "TikTok", { placeholder: "@ideafurniture" })}
        </div>
      </div>
      <div className="panel form">
        <h2>Studio</h2>
        <div className="form__row">
          {field("city", "City or town", { placeholder: "Beirut" })}
          {field("hours", "Opening hours", { placeholder: "Monday to Saturday, 10:00 to 19:00" })}
        </div>
        {field("address", "Address", { placeholder: "Street, building, area" })}
        <div className="form__row">
          {field("mapsUrl", "Google Maps link", { placeholder: "https://maps.app.goo.gl/…" })}
          {field("leadTime", "Typical lead time", { placeholder: "four to six weeks" })}
        </div>
      </div>
      <div className="panel form">
        <div className="spread">
          <h2 style={{ margin: 0 }}>Customer quotes</h2>
          <button type="button" className="btn btn--ghost btn--small" onClick={() => setF((s) => ({ ...s, testimonials: [...voices, { name: "", place: "", text: "" }] }))}>Add a quote</button>
        </div>
        <p className="muted small">Only add words a real customer gave you and agreed to share. The section stays hidden while this list is empty.</p>
        {voices.map((v, i) => (
          <div className="finish" key={i}>
            <label className="field"><span>What they said</span><textarea className="textarea" style={{ minHeight: 70 }} value={v.text} onChange={(e) => setVoice(i, { text: e.target.value })} /></label>
            <div className="form__row">
              <label className="field"><span>Name</span><input className="input" value={v.name} onChange={(e) => setVoice(i, { name: e.target.value })} /></label>
              <label className="field"><span>Town <em>(optional)</em></span><input className="input" value={v.place} onChange={(e) => setVoice(i, { place: e.target.value })} /></label>
            </div>
            <button type="button" className="btn btn--danger btn--small" style={{ justifySelf: "start" }} onClick={() => setF((s) => ({ ...s, testimonials: voices.filter((_, j) => j !== i) }))}>Remove</button>
          </div>
        ))}
      </div>
    </form>
  );
}

/* --------------------------------------------------------------------- shell */

export default function Admin() {
  useTitle("Admin");
  const { refreshSettings } = useShop();
  const [session, setSession] = useState(undefined); // undefined = checking
  const [denied, setDenied] = useState("");
  const [tab, setTab] = useState("overview");
  const [requests, setRequests] = useState([]);
  const [requestsOk, setRequestsOk] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const say = useCallback((text, bad = false) => {
    setToast({ text, bad });
    window.clearTimeout(say.t); say.t = window.setTimeout(() => setToast(null), bad ? 6000 : 2800);
  }, []);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => { if (alive) setSession(data.session || null); }).catch(() => alive && setSession(null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s || null));
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  // Only people on the staff list may stay signed in here.
  useEffect(() => {
    if (!session) return;
    supabase.rpc("is_staff").then(({ data, error }) => {
      if (!error && data === false) {
        setDenied("That account isn't on the staff list for this shop.");
        supabase.auth.signOut();
      }
    });
  }, [session]);

  const loadRequests = useCallback(async () => {
    const { data, error } = await supabase.from("requests").select("*").order("created_at", { ascending: false }).limit(500);
    setRequestsOk(!error);
    setRequests(error ? [] : data || []);
  }, []);
  useEffect(() => { if (session) loadRequests(); }, [session, loadRequests]);

  const saveSettings = useCallback(async (next, quiet) => {
    const data = { ...next };
    const { data: rows, error } = await supabase.from("site_settings").update({ data, updated_at: new Date().toISOString() }).eq("id", 1).select("id");
    if (error || !rows || rows.length === 0) { say("Couldn't save settings" + (error ? ": " + error.message : ". Has supabase/setup.sql been run?"), true); return false; }
    await refreshSettings();
    if (!quiet) say("Settings saved. The site is updated.");
    return true;
  }, [refreshSettings, say]);

  const go = (t, id) => { setTab(t); if (id !== undefined) setSelected(id); window.scrollTo(0, 0); };
  const fresh = useMemo(() => requests.filter((r) => r.status === "New").length, [requests]);

  if (session === undefined) return <div className="login"><p style={{ color: "var(--paper)" }}>Loading…</p></div>;
  if (!session) return <Login notice={denied} />;

  const tabs = [["overview", "Overview"], ["requests", "Requests"], ["pieces", "Pieces"], ["settings", "Settings"]];
  return (
    <div className="admin">
      <aside className="admin__side on-dark">
        <div className="wordmark">IDEA<span>.</span></div>
        <nav className="admin__nav" aria-label="Admin">
          {tabs.map(([id, label]) => (
            <button key={id} className="admin__tab" aria-current={tab === id} onClick={() => go(id)}>
              {label}{id === "requests" && fresh > 0 && <span className="count">{fresh}</span>}
            </button>
          ))}
        </nav>
        <div className="admin__foot">
          <Link className="admin__tab" to="/">View website</Link>
          <button className="admin__tab" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </aside>
      <div className="admin__main">
        {tab === "overview" && <Overview requests={requests} requestsOk={requestsOk} go={go} />}
        {tab === "requests" && <Requests requests={requests} requestsOk={requestsOk} reload={loadRequests} selectedId={selected} select={setSelected} say={say} />}
        {tab === "pieces" && <Pieces say={say} saveSettings={saveSettings} />}
        {tab === "settings" && <Settings saveSettings={saveSettings} />}
      </div>
      {toast && <div className={`toast${toast.bad ? " toast--bad" : ""}`} role="status">{toast.text}</div>}
    </div>
  );
}
