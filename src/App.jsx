import { useState, useEffect, useRef } from "react";

const PRODUCTS = [
  { id:1, cat:"Living Room", name:"Arc Sofa", mat:"Italian Linen", price:2400, tag:"Bestseller", desc:"Clean lines, deep comfort. Crafted in solid walnut with hand-stitched upholstery. Available in 3 widths.", dims:"W220 × D90 × H75 cm", img:"sofa",
    colors:[{n:"Sand",h:"#C9B99A",photo:"/sofa-sand.jpg"},{n:"Slate",h:"#6B6B6B",photo:"/sofa-slate.jpg"},{n:"Onyx",h:"#2C2C2C",photo:"/sofa-onyx.jpg"},{n:"Ivory",h:"#E8E0D5",photo:"/sofa-ivory.jpg"}],
    sizes:["2-Seater","3-Seater","Corner L-Shape"],
    sizePhotos:{
      "2-Seater":  {Sand:"/2seater-sand.jpg", Slate:"/2seater-slate.jpg", Onyx:"/2seater-onyx.jpg", Ivory:"/2seater-ivory.jpg"},
      "3-Seater":  {Sand:"/sofa-sand.jpg",    Slate:"/sofa-slate.jpg",    Onyx:"/sofa-onyx.jpg",   Ivory:"/sofa-ivory.jpg"},
      "Corner L-Shape": {Sand:"/corner-sand.jpg", Slate:"/corner-slate.jpg", Onyx:"/corner-onyx.jpg", Ivory:"/corner-ivory.jpg"},
    }
  },
  { id:32, cat:"Living Room", name:"Curved Bouclé Corner I", mat:"Bouclé + Oak Legs", price:1350, tag:"New", desc:"Soft rounded edges in ivory bouclé. Modular L-shape with curved chaise — the kind of sofa you never want to leave. Oak round legs, fully customizable configuration.", dims:"W280 × D200 × H80 cm", img:"sofa", colors:[{n:"Ivory Bouclé",h:"#E8E0D5",photo:"/corner-curved-1.jpg"}], sizes:["Standard L","Large L","Custom"] },
  { id:33, cat:"Living Room", name:"Curved Bouclé Corner II", mat:"Bouclé + Oak Legs", price:1350, tag:"Bestseller", desc:"Open flowing silhouette in ivory bouclé. No rigid lines — just pure organic comfort. Round oak legs, open chaise design for ultimate lounging.", dims:"W270 × D190 × H78 cm", img:"sofa", colors:[{n:"Ivory Bouclé",h:"#E8E0D5",photo:"/corner-curved-2.jpg"}], sizes:["Standard L","Large L","Custom"] },
  { id:34, cat:"Living Room", name:"Deep L Corner Sofa", mat:"Bouclé + Walnut Frame", price:1350, tag:"Popular", desc:"Extra deep seats with a solid walnut wood frame base. Ivory bouclé cushions sit on a beautiful exposed walnut structure. Deep, luxurious, unforgettable.", dims:"W300 × D210 × H82 cm", img:"sofa", colors:[{n:"Ivory + Walnut",h:"#C9B99A",photo:"/corner-deep.jpg"}], sizes:["Standard L","Large L","Custom"] },
  { id:35, cat:"Living Room", name:"Classic L Corner Sofa", mat:"Italian Linen + Walnut", price:1350, tag:"Custom", desc:"Three-seat L-shape with walnut wood base frame and tapered legs. Italian linen in warm sand. Clean, structured, timeless — the classic corner done right.", dims:"W290 × D200 × H85 cm", img:"sofa", colors:[{n:"Sand Linen",h:"#C9B99A",photo:"/corner-classic.jpg"}], sizes:["Standard L","Large L","Custom"] },
  { id:36, cat:"Living Room", name:"Clean L Corner Sofa", mat:"Italian Linen + Walnut", price:1350, tag:"New", desc:"Sleek and refined L-shape with walnut base and tapered legs. Ivory Italian linen with roll-arm pillows. Understated luxury at its finest.", dims:"W295 × D205 × H83 cm", img:"sofa", colors:[{n:"Ivory Linen",h:"#E8E0D5",photo:"/corner-clean.jpg"}], sizes:["Standard L","Large L","Custom"] },
  { id:37, cat:"Living Room", name:"Grand U-Shape Sofa", mat:"Italian Linen + Walnut Panels", price:1350, tag:"Popular", desc:"The ultimate living room statement. U-shape modular sofa in slate gray with solid walnut side panels. Seats 8+ comfortably. Built for grand spaces, grand gatherings.", dims:"W380 × D300 × H85 cm", img:"sofa", colors:[{n:"Slate Gray",h:"#6B6B6B",photo:"/corner-ushape.jpg"}], sizes:["Standard U","Large U","Custom"] },

  { id:5, cat:"Entryway", name:"Walnut Tower Cabinet", mat:"Solid Dark Walnut", price:350, tag:"Bestseller", desc:"A bold tall cabinet in rich dark walnut. Two full-length doors hide everything inside — shoes, bags, accessories. Clean handleless design, built solid by hand.", dims:"W90 × D40 × H120 cm", img:"bookcase", colors:[{n:"Dark Walnut",h:"#5C3D2E",photo:"/shoe-tower.jpg"}], sizes:["Small 80cm","Standard 90cm","Wide 110cm"] },
  { id:14, cat:"Entryway", name:"Walnut Bench", mat:"Solid Walnut + Linen", price:350, tag:"New", desc:"Sit down, put your shoes on, store them below. Curved walnut frame with a hand-stitched linen cushion on top. 6 open compartments for easy access.", dims:"W100 × D35 × H50 cm", img:"nightstand", colors:[{n:"Walnut + Sand",h:"#8B6F5C",photo:"/shoe-bench.jpg"}], sizes:["Small 80cm","Standard 100cm","Large 120cm"] },
  { id:15, cat:"Entryway", name:"Oak Slim Cabinet", mat:"Solid Natural Oak", price:350, tag:"Popular", desc:"Light oak with tapered legs and a Scandinavian soul. Two doors for hidden storage, open bottom shelf for everyday shoes. A plant on top completes the picture.", dims:"W80 × D35 × H130 cm", img:"bookcase", colors:[{n:"Natural Oak",h:"#C9A96E",photo:"/shoe-slim.jpg"}], sizes:["Narrow 70cm","Standard 80cm","Wide 100cm"] },
  { id:16, cat:"Entryway", name:"Ash Sideboard", mat:"Solid Ash + Brass", price:350, tag:"Custom", desc:"Wide and low — the statement piece your entryway deserves. Four doors with brushed brass handles hide ample shoe storage inside. Doubles as a console table.", dims:"W160 × D40 × H55 cm", img:"bookcase", colors:[{n:"Smoked Ash",h:"#9B8B7A",photo:"/shoe-sideboard.jpg"}], sizes:["Standard 160cm","Wide 200cm","Full Custom"] },
  { id:11, cat:"Living Room", name:"Walnut Media Wall", mat:"Solid Dark Walnut", price:800, tag:"Bestseller", desc:"Floating wall-mounted TV unit in rich dark walnut. Upper open shelf for books and decor, lower cabinet with doors for hidden storage. Built entirely by hand in our Beirut workshop.", dims:"W220 × D40 × H160 cm", img:"shelf", colors:[{n:"Dark Walnut",h:"#5C3D2E",photo:"/tv-walnut.jpg"}], sizes:["Standard 220cm","Wide 260cm","Full Wall Custom"] },
  { id:17, cat:"Living Room", name:"Noir Media Wall", mat:"Ebonized Solid Wood", price:800, tag:"New", desc:"Dramatic ebonized finish with matte black legs. A bold statement piece that anchors any living room. Upper display shelf, lower cabinet with open center compartment.", dims:"W240 × D40 × H170 cm", img:"shelf", colors:[{n:"Ebonized Black",h:"#1A1A1A",photo:"/tv-ebonized.jpg"}], sizes:["Standard 240cm","Wide 280cm","Full Wall Custom"] },
  { id:18, cat:"Living Room", name:"Ash Media Wall", mat:"Light Ash Wood", price:800, tag:"Popular", desc:"Light ash wood with matte black handles. Warm and inviting with a Scandinavian edge. Low-profile cabinet with drawers and center doors, floating wall shelf above.", dims:"W200 × D40 × H160 cm", img:"shelf", colors:[{n:"Light Ash",h:"#C9A96E",photo:"/tv-ash.jpg"}], sizes:["Standard 200cm","Wide 240cm","Full Wall Custom"] },
  { id:19, cat:"Living Room", name:"Oak Media Wall", mat:"Solid Natural Oak", price:800, tag:"Custom", desc:"Natural oak in its purest form. Four-door low cabinet with hidden storage, floating wall shelf above. The warmth of real wood grain, styled for modern living.", dims:"W220 × D40 × H165 cm", img:"shelf", colors:[{n:"Natural Oak",h:"#8B6F5C",photo:"/tv-oak.jpg"}], sizes:["Standard 220cm","Wide 260cm","Full Wall Custom"] },

  { id:2, cat:"Bedroom", name:"Zen Bed Frame", mat:"Solid Walnut", price:1800, tag:"New", desc:"A floating silhouette that transforms any bedroom into a sanctuary. Platform design, no box spring needed.", dims:"W180 × D210 × H40 cm", img:"bed", colors:[{n:"Walnut",h:"#8B6F5C"},{n:"Onyx",h:"#2C2C2C"},{n:"Sand",h:"#C9B99A"}], sizes:["Queen 160cm","King 180cm","Super King 200cm"] },
  { id:6, cat:"Bedroom", name:"Float Nightstand", mat:"Walnut + Brass", price:480, tag:"Bestseller", desc:"Wall-mounted with soft-close drawer and integrated brushed brass handle. Ships as a pair.", dims:"W50 × D35 × H30 cm", img:"nightstand", colors:[{n:"Walnut",h:"#8B6F5C"},{n:"Brass",h:"#C9A84C"},{n:"Onyx",h:"#2C2C2C"}], sizes:["Single","Pair"] },
  { id:10, cat:"Bedroom", name:"Loft Wardrobe", mat:"MDF + Walnut Veneer", price:2800, tag:"Custom", desc:"Floor-to-ceiling sliding wardrobe. Fully customizable interior — drawers, rails, shelves as you need.", dims:"W240 × D65 × H260 cm", img:"bookcase", colors:[{n:"Walnut",h:"#8B6F5C"},{n:"White Matt",h:"#E8E0D5"},{n:"Onyx",h:"#2C2C2C"}], sizes:["180cm Wide","240cm Wide","300cm Wide","Full Custom"] },
  { id:20, cat:"Bedroom", name:"Walnut Double Dresser", mat:"Solid Dark Walnut", price:400, tag:"Bestseller", desc:"Six drawers in two columns, handleless push-to-open design. Rich dark walnut grain makes every piece one of a kind.", dims:"W140 × D45 × H80 cm", img:"bookcase", colors:[{n:"Dark Walnut",h:"#5C3D2E",photo:"/dresser-walnut-double.jpg"}], sizes:["Standard 140cm","Wide 160cm"] },
  { id:21, cat:"Bedroom", name:"Walnut Low Dresser", mat:"Solid Walnut", price:400, tag:"New", desc:"Low and wide with tapered legs and round wood knobs. A mid-century soul with a modern edge.", dims:"W120 × D45 × H65 cm", img:"nightstand", colors:[{n:"Walnut",h:"#8B6F5C",photo:"/dresser-walnut-low.jpg"}], sizes:["Standard 120cm","Wide 140cm"] },
  { id:22, cat:"Bedroom", name:"Walnut Mid Dresser", mat:"Solid Walnut", price:400, tag:"Popular", desc:"Three deep drawers with recessed cut handles. Clean, sculptural, no excess.", dims:"W90 × D45 × H75 cm", img:"nightstand", colors:[{n:"Walnut",h:"#8B6F5C",photo:"/dresser-walnut-mid.jpg"}], sizes:["Standard 90cm","Wide 110cm"] },
  { id:23, cat:"Bedroom", name:"Ash Wide Dresser", mat:"Solid Ash + Brass", price:400, tag:"Custom", desc:"Three wide drawers with brushed brass bar handles. Light ash wood with a warm golden tone.", dims:"W130 × D45 × H75 cm", img:"bookcase", colors:[{n:"Natural Ash",h:"#C9A96E",photo:"/dresser-ash.jpg"}], sizes:["Standard 130cm","Wide 150cm"] },
  { id:24, cat:"Bedroom", name:"Oak Grand Dresser", mat:"Solid Oak + Brass", price:400, tag:"Popular", desc:"Six drawers, two columns, brass bar handles. A grand dresser with a timeless silhouette.", dims:"W150 × D45 × H80 cm", img:"bookcase", colors:[{n:"Natural Oak",h:"#C9A96E",photo:"/dresser-oak.jpg"}], sizes:["Standard 150cm","Wide 170cm"] },
  { id:25, cat:"Bedroom", name:"Oak Tufted Bed", mat:"Solid Oak + Linen", price:1200, tag:"Bestseller", desc:"Solid oak frame with a tall diamond-tufted linen headboard. Classic elegance meets modern craftsmanship. A bed that becomes the heart of your bedroom.", dims:"W180 × D220 × H140 cm", img:"bed", colors:[{n:"Natural Oak",h:"#C9A96E",photo:"/bed-oak-tufted.jpg"}], sizes:["Queen 160cm","King 180cm","Super King 200cm"] },
  { id:26, cat:"Bedroom", name:"Oak Upholstered Bed", mat:"Solid Oak + Linen", price:1200, tag:"New", desc:"Tall oak-framed headboard with clean linen upholstery. No buttons, no fuss — just pure sophisticated comfort.", dims:"W180 × D220 × H150 cm", img:"bed", colors:[{n:"Natural Oak",h:"#C9A96E",photo:"/bed-oak-upholstered.jpg"}], sizes:["Queen 160cm","King 180cm","Super King 200cm"] },
  { id:27, cat:"Bedroom", name:"Oak Wide Bed", mat:"Solid Oak + Linen", price:1200, tag:"Popular", desc:"Wide tufted headboard in linen with an oak frame. Low-profile platform design for a grounded, calming feel.", dims:"W200 × D220 × H120 cm", img:"bed", colors:[{n:"Natural Oak",h:"#C9A96E",photo:"/bed-oak-wide.jpg"}], sizes:["Queen 160cm","King 180cm","Super King 200cm"] },
  { id:28, cat:"Bedroom", name:"Walnut Curved Bed", mat:"Solid Walnut", price:1200, tag:"Custom", desc:"Curved solid walnut headboard — no upholstery, just pure wood. Mid-century inspired silhouette with tapered legs. A statement in natural beauty.", dims:"W180 × D220 × H100 cm", img:"bed", colors:[{n:"Dark Walnut",h:"#5C3D2E",photo:"/bed-walnut-curved.jpg"}], sizes:["Queen 160cm","King 180cm","Super King 200cm"] },
  { id:29, cat:"Bedroom", name:"Walnut Boho Bed", mat:"Solid Walnut", price:1200, tag:"New", desc:"Walnut frame with a gently curved wooden headboard. Styled with plants and natural textures — a bed that feels like a retreat.", dims:"W180 × D220 × H95 cm", img:"bed", colors:[{n:"Dark Walnut",h:"#5C3D2E",photo:"/bed-walnut-boho.jpg"}], sizes:["Queen 160cm","King 180cm","Super King 200cm"] },
  { id:30, cat:"Bedroom", name:"Walnut Platform Bed", mat:"Solid Walnut", price:1200, tag:"Bestseller", desc:"Ultra-low platform bed in solid walnut. Flat wood headboard, integrated floating nightstands. Minimalism at its most luxurious.", dims:"W200 × D230 × H80 cm", img:"bed", colors:[{n:"Dark Walnut",h:"#5C3D2E",photo:"/bed-walnut-platform.jpg"}], sizes:["Queen 160cm","King 180cm","Super King 200cm"] },
  { id:31, cat:"Bedroom", name:"Walnut Room Bed", mat:"Solid Walnut", price:1200, tag:"Popular", desc:"Low platform walnut bed styled as a complete room moment. Clean wood headboard, flanked by matching nightstands. The full bedroom vision.", dims:"W200 × D230 × H85 cm", img:"bed", colors:[{n:"Dark Walnut",h:"#5C3D2E",photo:"/bed-walnut-room.jpg"}], sizes:["Queen 160cm","King 180cm","Super King 200cm"] },
];

const QUOTES = [
  { id:"Q001", name:"Rania Khalil", email:"rania@email.com", phone:"+961 70 123456", product:"Arc Sofa", color:"Sand", size:"3-Seater", msg:"Looking for a large corner sofa for my living room", date:"Jan 15", status:"New", budget:"$2,400" },
  { id:"Q002", name:"Georges Mansour", email:"georges@email.com", phone:"+961 3 987654", product:"Slab Dining Table", color:"Natural Oak", size:"8-Seater 220cm", msg:"Need a dining table for 8 people, open to custom sizes", date:"Jan 14", status:"In Progress", budget:"$3,200" },
  { id:"Q003", name:"Lara Azzi", email:"lara@email.com", phone:"+961 76 555444", product:"Zen Bed Frame", color:"Walnut", size:"King 180cm", msg:"Master bedroom renovation, need bed + nightstands", date:"Jan 13", status:"Quoted", budget:"$2,500" },
  { id:"Q004", name:"Marc Habib", email:"marc@email.com", phone:"+961 81 222333", product:"Focus Desk", color:"Onyx", size:"L-Shape 200cm", msg:"Home office setup, need desk and storage", date:"Jan 12", status:"Closed", budget:"$1,200" },
];

const FurnitureSVG = ({ type, color = "#8B6F5C" }) => {
  const c = color;
  const svgs = {
    sofa: <svg viewBox="0 0 240 140" fill="none" width="100%" height="100%"><rect x="12" y="65" width="216" height="54" rx="10" fill={c} fillOpacity=".12" stroke={c} strokeWidth="1.5"/><rect x="24" y="48" width="84" height="54" rx="8" fill={c} fillOpacity=".18" stroke={c} strokeWidth="1.5"/><rect x="132" y="48" width="84" height="54" rx="8" fill={c} fillOpacity=".18" stroke={c} strokeWidth="1.5"/><rect x="12" y="42" width="24" height="77" rx="8" fill={c} fillOpacity=".25" stroke={c} strokeWidth="1.5"/><rect x="204" y="42" width="24" height="77" rx="8" fill={c} fillOpacity=".25" stroke={c} strokeWidth="1.5"/><rect x="28" y="119" width="18" height="14" rx="4" fill={c} fillOpacity=".5"/><rect x="194" y="119" width="18" height="14" rx="4" fill={c} fillOpacity=".5"/></svg>,
    bed: <svg viewBox="0 0 240 140" fill="none" width="100%" height="100%"><rect x="18" y="70" width="204" height="54" rx="5" fill={c} fillOpacity=".12" stroke={c} strokeWidth="1.5"/><rect x="18" y="24" width="24" height="100" rx="5" fill={c} fillOpacity=".28" stroke={c} strokeWidth="1.5"/><rect x="36" y="76" width="72" height="36" rx="18" fill={c} fillOpacity=".22" stroke={c} strokeWidth="1.3"/><rect x="126" y="76" width="90" height="36" rx="5" fill={c} fillOpacity=".15" stroke={c} strokeWidth="1.3"/><rect x="30" y="124" width="14" height="12" rx="3" fill={c} fillOpacity=".6"/><rect x="196" y="124" width="14" height="12" rx="3" fill={c} fillOpacity=".6"/></svg>,
    table: <svg viewBox="0 0 240 140" fill="none" width="100%" height="100%"><rect x="12" y="52" width="216" height="22" rx="5" fill={c} fillOpacity=".18" stroke={c} strokeWidth="1.5"/><path d="M12 52 Q120 36 228 52" stroke={c} strokeWidth="1.3" fill="none" opacity=".5"/><rect x="24" y="74" width="14" height="54" rx="4" fill={c} fillOpacity=".28" stroke={c} strokeWidth="1.3"/><rect x="202" y="74" width="14" height="54" rx="4" fill={c} fillOpacity=".28" stroke={c} strokeWidth="1.3"/></svg>,
    desk: <svg viewBox="0 0 240 140" fill="none" width="100%" height="100%"><rect x="12" y="58" width="216" height="16" rx="4" fill={c} fillOpacity=".18" stroke={c} strokeWidth="1.5"/><rect x="12" y="74" width="16" height="56" rx="4" fill={c} fillOpacity=".25" stroke={c} strokeWidth="1.3"/><rect x="212" y="74" width="16" height="56" rx="4" fill={c} fillOpacity=".25" stroke={c} strokeWidth="1.3"/><rect x="156" y="74" width="48" height="36" rx="3" fill={c} fillOpacity=".1" stroke={c} strokeWidth="1.2"/><rect x="168" y="83" width="24" height="3" rx="1" fill={c} fillOpacity=".4"/><rect x="168" y="91" width="18" height="3" rx="1" fill={c} fillOpacity=".3"/></svg>,
    shelf: <svg viewBox="0 0 240 140" fill="none" width="100%" height="100%"><rect x="36" y="16" width="168" height="10" rx="2.5" fill={c} fillOpacity=".28" stroke={c} strokeWidth="1.3"/><rect x="36" y="65" width="168" height="10" rx="2.5" fill={c} fillOpacity=".28" stroke={c} strokeWidth="1.3"/><rect x="36" y="114" width="168" height="10" rx="2.5" fill={c} fillOpacity=".28" stroke={c} strokeWidth="1.3"/><rect x="42" y="28" width="20" height="35" rx="2" fill={c} fillOpacity=".2"/><rect x="66" y="33" width="16" height="30" rx="2" fill={c} fillOpacity=".15"/><rect x="86" y="26" width="24" height="37" rx="2" fill={c} fillOpacity=".22"/></svg>,
    nightstand: <svg viewBox="0 0 240 140" fill="none" width="100%" height="100%"><rect x="60" y="24" width="120" height="102" rx="5" fill={c} fillOpacity=".12" stroke={c} strokeWidth="1.5"/><rect x="60" y="66" width="120" height="3" fill={c} fillOpacity=".3"/><circle cx="120" cy="86" r="6" fill={c} fillOpacity=".4" stroke={c} strokeWidth="1.5"/><rect x="78" y="126" width="18" height="12" rx="3" fill={c} fillOpacity=".5"/><rect x="144" y="126" width="18" height="12" rx="3" fill={c} fillOpacity=".5"/></svg>,
    chair: <svg viewBox="0 0 240 140" fill="none" width="100%" height="100%"><path d="M72 36 Q120 24 168 36 L174 90 Q120 102 66 90 Z" fill={c} fillOpacity=".15" stroke={c} strokeWidth="1.5"/><rect x="66" y="90" width="108" height="14" rx="5" fill={c} fillOpacity=".25" stroke={c} strokeWidth="1.3"/><rect x="78" y="104" width="12" height="34" rx="4" fill={c} fillOpacity=".3"/><rect x="150" y="104" width="12" height="34" rx="4" fill={c} fillOpacity=".3"/></svg>,
    bookcase: <svg viewBox="0 0 240 140" fill="none" width="100%" height="100%"><rect x="24" y="12" width="192" height="116" rx="4" fill={c} fillOpacity=".07" stroke={c} strokeWidth="1.5"/><rect x="24" y="51" width="192" height="3" fill={c} fillOpacity=".28"/><rect x="24" y="90" width="192" height="3" fill={c} fillOpacity=".28"/><rect x="120" y="12" width="3" height="116" fill={c} fillOpacity=".18"/><rect x="36" y="20" width="18" height="28" rx="1.5" fill={c} fillOpacity=".25"/><rect x="58" y="17" width="24" height="31" rx="1.5" fill={c} fillOpacity=".3"/><rect x="86" y="22" width="16" height="26" rx="1.5" fill={c} fillOpacity=".2"/><rect x="130" y="18" width="20" height="30" rx="1.5" fill={c} fillOpacity=".28"/></svg>,
  };
  return svgs[type] || svgs.sofa;
};

const CSS = `
  .sf { font-family: 'Playfair Display', Georgia, serif; }
  .b1 { background: #1A1714; color: #F4F1ED; border: none; padding: 13px 28px; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: .13em; text-transform: uppercase; cursor: pointer; transition: background .25s; display: inline-flex; align-items: center; gap: 8px; }
  .b1:hover { background: #8B6F5C; }
  .b2 { background: #8B6F5C; color: white; border: none; padding: 13px 28px; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: .13em; text-transform: uppercase; cursor: pointer; transition: background .25s; display: inline-flex; align-items: center; gap: 8px; }
  .b2:hover { background: #7A5F4C; }
  .b3 { background: transparent; color: #1A1714; border: 1px solid rgba(26,23,20,.22); padding: 11px 24px; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: .13em; text-transform: uppercase; cursor: pointer; transition: all .25s; display: inline-flex; align-items: center; gap: 8px; }
  .b3:hover { background: #1A1714; color: #F4F1ED; }
  .inp { width: 100%; background: transparent; border: none; border-bottom: 1px solid rgba(26,23,20,.18); padding: 11px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1A1714; outline: none; transition: border-color .3s; }
  .inp:focus { border-bottom-color: #8B6F5C; }
  .inp::placeholder { color: #bbb; font-weight: 300; }
  .card { background: white; cursor: pointer; transition: transform .35s, box-shadow .35s; }
  .card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,.09); }
  .ov { position: fixed; inset: 0; background: rgba(0,0,0,.68); z-index: 200; backdrop-filter: blur(5px); }
  .mo { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); background: #F4F1ED; z-index: 201; max-height: 92vh; overflow-y: auto; width: min(94vw, 940px); }
  .qmo { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); background: #F4F1ED; z-index: 201; max-height: 92vh; overflow-y: auto; width: min(94vw, 480px); padding: 44px 40px; }
  @keyframes fu { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes mq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes dk { 0%,100% { opacity: .4; } 50% { opacity: .9; } }
  .fu { animation: fu .7s ease both; }
  .mqr { animation: mq 20s linear infinite; display: flex; gap: 56px; white-space: nowrap; }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: #8B6F5C; display: inline-block; animation: dk 1.2s ease infinite; }
  .nav-link { font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #6B6460; cursor: pointer; transition: color .2s; }
  .nav-link:hover { color: #8B6F5C; }
  .swatch { width: 22px; height: 22px; border-radius: 50%; cursor: pointer; transition: transform .2s, box-shadow .2s; }
  .swatch.on { transform: scale(1.2); box-shadow: 0 0 0 2px white, 0 0 0 3px #8B6F5C; }
  .szb { padding: 6px 12px; background: transparent; color: #6B6460; border: 1px solid rgba(26,23,20,.18); font-family: 'DM Sans', sans-serif; font-size: 11px; cursor: pointer; transition: all .2s; }
  .szb.on { background: #1A1714; color: white; }
  .stb { padding: 4px 10px; background: transparent; color: #6B6460; border: 1px solid rgba(26,23,20,.16); font-family: 'DM Sans', sans-serif; font-size: 10px; cursor: pointer; transition: all .2s; }
  .stb.on { background: #1A1714; color: white; }
  .an { padding: 10px 15px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 300; border-radius: 4px; margin-bottom: 2px; transition: all .2s; color: rgba(255,255,255,.45); }
  .an:hover, .an.on { background: rgba(255,255,255,.08); color: white; }
  .stat { background: white; padding: 20px 22px; border-left: 3px solid #8B6F5C; }
  .qrow { display: grid; grid-template-columns: 1fr auto; gap: 12px; padding: 14px 18px; cursor: pointer; border-left: 3px solid transparent; transition: all .2s; background: white; margin-bottom: 2px; }
  .qrow:hover, .qrow.on { background: #FAF8F5; border-left-color: #8B6F5C; }
  .pi { padding: 10px 15px; cursor: pointer; border-left: 3px solid transparent; transition: all .2s; display: flex; gap: 10px; align-items: center; }
  .pi:hover, .pi.on { background: rgba(139,111,92,.08); border-left-color: #8B6F5C; }
  .aib { background: linear-gradient(135deg,#8B6F5C,#6B4F3C); color: white; padding: 12px 15px; border-radius: 0 12px 12px 12px; font-family: 'DM Sans', sans-serif; font-size: 12px; line-height: 1.6; max-width: 85%; }
  .ub { background: #1A1714; color: #F4F1ED; padding: 12px 15px; border-radius: 12px 0 12px 12px; font-family: 'DM Sans', sans-serif; font-size: 12px; line-height: 1.6; max-width: 85%; margin-left: auto; }
  select.inp { -webkit-appearance: none; }
`;

export default function App() {
  const [page, setPage] = useState("home");
  const [auth, setAuth] = useState(false);
  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#F4F1ED", color: "#1A1714" }}>
      <style>{CSS}</style>
      {page === "home" && <Home go={setPage} />}
      {page === "catalog" && <Catalog go={setPage} />}
      {page === "viz" && <Viz go={setPage} />}
      {page === "admin" && <Admin go={setPage} auth={auth} setAuth={setAuth} />}
    </div>
  );
}

function NavBar({ go, dark, onQ }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const bg = dark ? "#1A1714" : scrolled ? "rgba(244,241,237,.96)" : "#F4F1ED";
  const cl = dark ? "white" : "#1A1714";
  return (
    <nav style={{ height: 66, background: bg, backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${dark ? "rgba(255,255,255,.07)" : "rgba(26,23,20,.08)"}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 52px", position: "sticky", top: 0, zIndex: 50, transition: "all .3s" }}>
      <button onClick={() => go("home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
        <span className="sf" style={{ fontSize: 24, color: cl, letterSpacing: ".2em", fontWeight: 300 }}>IDEA<span style={{ color: "#8B6F5C" }}>.</span></span>
      </button>
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {[["Collection","catalog"],["Visualizer","viz"],["About","home"]].map(([l,p]) => (
          <span key={l} className="nav-link" style={{ color: dark ? "rgba(255,255,255,.55)" : "#6B6460" }} onClick={() => go(p)}>{l}</span>
        ))}
        {onQ && <button className="b1" style={{ padding: "8px 20px", fontSize: 10 }} onClick={onQ}>Get Quote</button>}
        <span className="nav-link" style={{ fontSize: 10, color: "#9B9390" }} onClick={() => go("admin")}>Admin</span>
      </div>
    </nav>
  );
}

/* ─── HOME ─── */
function Home({ go }) {
  const [qOpen, setQOpen] = useState(false);
  const words = ["Custom Furniture","·","Handcrafted","·","Beirut Workshop","·","Made to Measure","·","Solid Wood","·","Bespoke Design","·"];
  return (
    <div>
      <NavBar go={go} onQ={() => setQOpen(true)} />
      <div style={{ display: "grid", gridTemplateColumns: "55% 45%", minHeight: "calc(100vh - 66px)" }}>
        <div style={{ padding: "68px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="fu" style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "#8B6F5C", marginBottom: 24, animationDelay: ".05s" }}>Handcrafted in Beirut · Est. 2024</div>
          <h1 className="sf fu" style={{ fontSize: "clamp(44px,5.5vw,74px)", fontWeight: 300, lineHeight: 1.03, marginBottom: 28, animationDelay: ".15s" }}>Where every<br /><em>idea</em><br />takes form.</h1>
          <p className="fu" style={{ fontFamily: "'DM Sans'", fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: "#6B6460", maxWidth: 380, marginBottom: 36, animationDelay: ".28s" }}>Custom furniture, built by hand in our Beirut workshop. Every piece made for you, and only you.</p>
          <div className="fu" style={{ display: "flex", gap: 10, flexWrap: "wrap", animationDelay: ".4s" }}>
            <button className="b1" onClick={() => go("catalog")}>Explore Collection →</button>
            <button className="b3" onClick={() => go("viz")}>✦ Room Visualizer</button>
          </div>
          <div className="fu" style={{ display: "flex", gap: 44, marginTop: 50, animationDelay: ".52s" }}>
            {[["200+","Pieces Crafted"],["8yr","Experience"],["100%","Bespoke"]].map(([n,l]) => (
              <div key={l}><div className="sf" style={{ fontSize: 27, fontWeight: 300 }}>{n}</div><div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".1em", color: "#9B9390", textTransform: "uppercase", marginTop: 3 }}>{l}</div></div>
            ))}
          </div>
        </div>
        <div style={{ background: "#1A1714", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", minHeight: "calc(100vh - 66px)" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 28% 45%, rgba(139,111,92,.3) 0%, transparent 62%)" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
            <img src="/corner-curved-2.jpg" alt="Corner Sofa" style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center center", background: "#E8E4DF" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(26,23,20,.05) 0%, transparent 40%, rgba(26,23,20,.5) 100%)" }} />
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 36px", borderTop: "1px solid rgba(255,255,255,.06)", zIndex: 2 }}>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".16em", color: "rgba(255,255,255,.5)", textTransform: "uppercase" }}>Featured</div>
            <div className="sf" style={{ fontSize: 21, color: "white", marginTop: 4, fontWeight: 300 }}>Curved Bouclé Corner II</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#C9B99A", marginTop: 3 }}>From $1,350</div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div style={{ background: "#8B6F5C", padding: "12px 0", overflow: "hidden" }}>
        <div className="mqr">{[...Array(3)].map((_,i) => words.map((t,j) => <span key={`${i}-${j}`} style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.85)" }}>{t}</span>))}</div>
      </div>

      {/* Featured Products */}
      <div style={{ padding: "72px 56px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44 }}>
          <div><div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".2em", color: "#8B6F5C", textTransform: "uppercase", marginBottom: 10 }}>Our Collection</div><h2 className="sf" style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 300 }}>Crafted for <em>your space</em></h2></div>
          <button className="b3" onClick={() => go("catalog")}>View All →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {PRODUCTS.slice(0,3).map(p => <ProductCard key={p.id} p={p} onClick={() => go("catalog")} />)}
        </div>
      </div>

      {/* Visualizer Promo */}
      <div style={{ background: "#1A1714", padding: "72px 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".2em", color: "#8B6F5C", textTransform: "uppercase", marginBottom: 18 }}>AI Room Visualizer</div>
          <h2 className="sf" style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 300, color: "white", lineHeight: 1.1, marginBottom: 22 }}>See it in your <em style={{ color: "#C9B99A" }}>home</em> before you order.</h2>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,.45)", lineHeight: 1.8, maxWidth: 340, marginBottom: 30 }}>Upload a photo of your room. Our AI places any piece into your space at real scale.</p>
          {["Upload your room photo","Choose & customize furniture","AI places it in your room","Request a quote for that config"].map((s,i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 13 }}>
              <div style={{ width: 27, height: 27, border: "1px solid rgba(139,111,92,.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#8B6F5C" }}>0{i+1}</span></div>
              <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "rgba(255,255,255,.48)", fontWeight: 300 }}>{s}</span>
            </div>
          ))}
          <button className="b2" style={{ marginTop: 30 }} onClick={() => go("viz")}>✦ Open Visualizer</button>
        </div>
        <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", padding: 36 }}>
          <div style={{ aspectRatio: "4/3", background: "rgba(255,255,255,.02)", border: "2px dashed rgba(139,111,92,.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ fontSize: 32 }}>📷</div>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "rgba(255,255,255,.28)", textAlign: "center" }}>Upload room photo</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {PRODUCTS.slice(0,4).map(p => <div key={p.id} style={{ padding: "7px 12px", border: "1px solid rgba(255,255,255,.06)" }}><span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "rgba(255,255,255,.35)" }}>{p.name}</span></div>)}
          </div>
        </div>
      </div>

      {/* Process */}
      <div style={{ padding: "72px 56px", background: "#FAF8F5" }}>
        <div style={{ textAlign: "center", marginBottom: 54 }}>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".2em", color: "#8B6F5C", textTransform: "uppercase", marginBottom: 10 }}>How It Works</div>
          <h2 className="sf" style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 300 }}>From idea to delivery</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 36 }}>
          {[{n:"01",t:"Choose or Design",d:"Browse our collection or bring your vision — sketches, photos, or pure imagination."},{n:"02",t:"Customize Everything",d:"Wood, finish, fabric, dimensions — all yours. No two pieces are the same."},{n:"03",t:"We Build It",d:"Our craftsmen get to work in Beirut. You get updates at every stage."},{n:"04",t:"Delivered to You",d:"White-glove delivery and professional installation. Your space, transformed."}].map((x,i) => (
            <div key={i} style={{ borderTop: "1px solid #D8D2CB", paddingTop: 26 }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".14em", color: "#8B6F5C", marginBottom: 14 }}>{x.n}</div>
              <h3 className="sf" style={{ fontSize: 20, fontWeight: 300, marginBottom: 10 }}>{x.t}</h3>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#7A736E", lineHeight: 1.75, fontWeight: 300 }}>{x.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: "72px 56px" }}>
        <h2 className="sf" style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 300, textAlign: "center", marginBottom: 42 }}>What our clients say</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {[{n:"Rania K.",l:"Beirut",t:"I gave them a sketch and they came back with something beyond what I imagined. The table is the centerpiece of our home."},{n:"Georges M.",l:"Jounieh",t:"IDEA is on a completely different level. The craftsmanship is extraordinary. Worth every penny."},{n:"Lara A.",l:"Achrafieh",t:"The room visualizer sold me. I saw the sofa in my living room before ordering. Zero surprises on delivery day."}].map((x,i) => (
            <div key={i} style={{ background: "white", padding: "28px 26px" }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>{[...Array(5)].map((_,j) => <span key={j} style={{ color: "#C9A84C", fontSize: 13 }}>★</span>)}</div>
              <div className="sf" style={{ fontSize: 32, color: "#D8D2CB", lineHeight: 1, marginBottom: 12 }}>"</div>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 300, lineHeight: 1.8, color: "#5A5350", marginBottom: 22 }}>{x.t}</p>
              <div style={{ borderTop: "1px solid #EDE9E4", paddingTop: 14 }}><div className="sf" style={{ fontSize: 15 }}>{x.n}</div><div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8B6F5C", marginTop: 3 }}>{x.l}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#1A1714", padding: "90px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% -5%, rgba(139,111,92,.2) 0%, transparent 58%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".2em", color: "#8B6F5C", textTransform: "uppercase", marginBottom: 18 }}>Start Your Project</div>
          <h2 className="sf" style={{ fontSize: "clamp(34px,6vw,68px)", fontWeight: 300, color: "white", lineHeight: 1.0, marginBottom: 26 }}>You have an idea.<br /><em style={{ color: "#C9B99A" }}>We have the hands.</em></h2>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "rgba(255,255,255,.38)", maxWidth: 380, margin: "0 auto 40px", lineHeight: 1.75, fontWeight: 300 }}>Request a quote today. Our team reaches out within 24 hours.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="b2" style={{ padding: "14px 38px" }} onClick={() => setQOpen(true)}>Request a Free Quote</button>
            <a href="https://wa.me/96100000000?text=Hello%20IDEA%20Furniture!" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <button className="b3" style={{ borderColor: "rgba(255,255,255,.2)", color: "white", padding: "14px 38px" }}>💬 WhatsApp Us</button>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#0E0C0A", padding: "50px 56px 30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 44 }}>
          <div>
            <div className="sf" style={{ fontSize: 24, color: "white", marginBottom: 14 }}>IDEA<span style={{ color: "#8B6F5C" }}>.</span></div>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "rgba(255,255,255,.35)", lineHeight: 1.8, fontWeight: 300, maxWidth: 230 }}>Custom furniture crafted in Beirut. Every piece made by hand, made for you.</p>
          </div>
          {[{t:"Collection",l:["Living Room","Bedroom","Dining","Office","Bespoke"]},{t:"Company",l:["About","Workshop","Process","Contact"]},{t:"Contact",l:["Visit Gallery","hello@idea.lb","+961 XX XXX XXX","Beirut, Lebanon"]}].map(col => (
            <div key={col.t}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".13em", textTransform: "uppercase", color: "rgba(255,255,255,.42)", marginBottom: 16 }}>{col.t}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>{col.l.map(l => <span key={l} style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,.28)" }}>{l}</span>)}</div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 24, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "rgba(255,255,255,.2)" }}>© 2024 IDEA Furniture. All rights reserved.</span>
          <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "rgba(255,255,255,.2)" }}>Crafted in Lebanon 🇱🇧</span>
        </div>
      </div>

      {qOpen && <QuoteModal onClose={() => setQOpen(false)} />}
    </div>
  );
}

function ProductCard({ p, onClick }) {
  const tagStyle = p.tag === "New" ? { background: "#1A1714", color: "white" } : p.tag === "Bestseller" ? { background: "#8B6F5C", color: "white" } : { background: "transparent", color: "#8B6F5C", border: "1px solid #8B6F5C" };
  const mainPhoto = p.colors[0].photo;
  return (
    <div className="card" onClick={onClick}>
      <div style={{ height: 230, background: "#FAF8F5", display: "flex", alignItems: "center", justifyContent: "center", padding: mainPhoto ? 0 : 38, position: "relative", overflow: "hidden" }}>
        {mainPhoto ? <img src={mainPhoto} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "20px", background: "#FAF8F5" }} /> : <FurnitureSVG type={p.img} color={p.colors[0].h} />}
        <div style={{ position: "absolute", top: 12, left: 12 }}><span style={{ fontFamily: "'DM Sans'", fontSize: 9, letterSpacing: ".11em", textTransform: "uppercase", padding: "3px 9px", ...tagStyle }}>{p.tag}</span></div>
      </div>
      <div style={{ padding: "18px 22px 24px" }}>
        <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".12em", color: "#9B9390", textTransform: "uppercase", marginBottom: 5 }}>{p.cat}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="sf" style={{ fontSize: 20, fontWeight: 300 }}>{p.name}</span>
          <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8B6F5C" }}>From ${p.price.toLocaleString()}</span>
        </div>
        <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#9B9390", marginTop: 3 }}>{p.mat}</div>
        <div style={{ display: "flex", gap: 5, marginTop: 11 }}>{p.colors.map((c,i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c.h }} />)}</div>
      </div>
    </div>
  );
}

/* ─── CATALOG ─── */
function Catalog({ go }) {
  const [cat, setCat] = useState("All");
  const [sel, setSel] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [sc, setSc] = useState(0);
  const [ss, setSs] = useState(0);
  const [qOpen, setQOpen] = useState(false);
  const [qP, setQP] = useState(null);
  const cats = ["All","Living Room","Bedroom","Dining","Office","Entryway"];
  const list = cat === "All" ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
  const tagStyle = (tag) => tag === "New" ? { background: "#1A1714", color: "white" } : tag === "Bestseller" ? { background: "#8B6F5C", color: "white" } : { background: "transparent", color: "#8B6F5C", border: "1px solid #8B6F5C" };
  return (
    <div style={{ background: "#F4F1ED", minHeight: "100vh" }}>
      <NavBar go={go} onQ={() => setQOpen(true)} />
      <div style={{ padding: "38px 56px" }}>
        <div style={{ display: "flex", gap: 7, marginBottom: 38, flexWrap: "wrap" }}>
          {cats.map(c => <button key={c} onClick={() => setCat(c)} style={{ background: cat===c ? "#1A1714" : "transparent", color: cat===c ? "white" : "#6B6460", border: `1px solid ${cat===c ? "#1A1714" : "rgba(26,23,20,.18)"}`, padding: "7px 18px", fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".11em", textTransform: "uppercase", cursor: "pointer", transition: "all .22s" }}>{c}</button>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 20 }}>
          {list.map(p => (
            <div key={p.id} className="card" onClick={() => { setSel(p); setSc(0); setSs(0); }}>
              <div style={{ height: 220, background: "#FAF8F5", display: "flex", alignItems: "center", justifyContent: "center", padding: p.colors[0].photo ? 0 : 36, position: "relative", overflow: "hidden" }}>
                {p.colors[0].photo ? <img src={p.colors[0].photo} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "20px", background: "#FAF8F5" }} /> : <FurnitureSVG type={p.img} color={p.colors[0].h} />}
                <div style={{ position: "absolute", top: 11, left: 11 }}><span style={{ fontFamily: "'DM Sans'", fontSize: 9, letterSpacing: ".11em", textTransform: "uppercase", padding: "3px 9px", ...tagStyle(p.tag) }}>{p.tag}</span></div>
              </div>
              <div style={{ padding: "16px 20px 22px" }}>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".12em", color: "#9B9390", textTransform: "uppercase", marginBottom: 4 }}>{p.cat}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="sf" style={{ fontSize: 19, fontWeight: 300 }}>{p.name}</span>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8B6F5C" }}>From ${p.price.toLocaleString()}</span>
                </div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#9B9390", marginTop: 3 }}>{p.mat}</div>
                <div style={{ display: "flex", gap: 5, marginTop: 10 }}>{p.colors.map((c,i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c.h }} />)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sel && <>
        <div className="ov" onClick={() => { setSel(null); setFullscreen(false); }} />
        <div className="mo">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ background: "#FAF8F5", padding: sel.colors[sc].photo ? 0 : 52, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 440, overflow: "hidden", position: "relative" }}>
              {(() => {
                const photo = sel.sizePhotos
                  ? sel.sizePhotos[sel.sizes[ss]]?.[sel.colors[sc].n] || sel.colors[sc].photo
                  : sel.colors[sc].photo;
                return photo
                  ? <img src={photo} alt={sel.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "20px", background: "#FAF8F5" }} />
                  : <FurnitureSVG type={sel.img} color={sel.colors[sc].h} />;
              })()}
              {/* Fullscreen button */}
              {(sel.sizePhotos ? sel.sizePhotos[sel.sizes[ss]]?.[sel.colors[sc].n] || sel.colors[sc].photo : sel.colors[sc].photo) && (
                <button onClick={() => setFullscreen(true)}
                  style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(26,23,20,.75)", border: "none", color: "white", padding: "8px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(4px)", letterSpacing: ".08em" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
                  Full View
                </button>
              )}
            </div>

            {/* Fullscreen overlay */}
            {fullscreen && (() => {
              const photo = sel.sizePhotos
                ? sel.sizePhotos[sel.sizes[ss]]?.[sel.colors[sc].n] || sel.colors[sc].photo
                : sel.colors[sc].photo;
              return (
                <div onClick={() => setFullscreen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.95)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
                  <img src={photo} alt={sel.name} style={{ maxWidth: "92vw", maxHeight: "92vh", objectFit: "contain" }} />
                  <button onClick={() => setFullscreen(false)} style={{ position: "absolute", top: 24, right: 24, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", color: "white", width: 44, height: 44, borderRadius: "50%", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,.4)", letterSpacing: ".1em" }}>Click anywhere to close</div>
                </div>
              );
            })()}
            <div style={{ padding: "44px 44px 44px 36px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}><button onClick={() => setSel(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9B9390", fontSize: 22 }}>×</button></div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".12em", color: "#9B9390", textTransform: "uppercase", marginBottom: 5 }}>{sel.cat}</div>
              <h2 className="sf" style={{ fontSize: 32, fontWeight: 300, marginBottom: 5 }}>{sel.name}</h2>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#9B9390", marginBottom: 20 }}>{sel.mat}</div>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 300, lineHeight: 1.75, color: "#5A5350", marginBottom: 24 }}>{sel.desc}</p>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#9B9390", marginBottom: 9 }}>Finish — <span style={{ color: "#8B6F5C" }}>{sel.colors[sc].n}</span></div>
                <div style={{ display: "flex", gap: 9 }}>{sel.colors.map((c,i) => <div key={i} className={`swatch${sc===i?" on":""}`} style={{ background: c.h }} onClick={() => setSc(i)} title={c.n} />)}</div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#9B9390", marginBottom: 9 }}>Size</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{sel.sizes.map((s,i) => <button key={i} className={`szb${ss===i?" on":""}`} onClick={() => setSs(i)}>{s}</button>)}</div>
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#7A736E", marginBottom: 20 }}>📐 {sel.dims}</div>
              <div className="sf" style={{ fontSize: 26, color: "#8B6F5C", marginBottom: 22 }}>From ${sel.price.toLocaleString()}</div>
              <button className="b1" style={{ width: "100%", justifyContent: "center", padding: 14 }} onClick={() => { setSel(null); setQP(sel); setQOpen(true); }}>Request a Quote for This Piece</button>
              <a href={`https://wa.me/96100000000?text=Hi!%20Interested%20in%20the%20${encodeURIComponent(sel.name)}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none", marginTop: 10 }}>
                <button className="b3" style={{ width: "100%", justifyContent: "center", padding: 12 }}>💬 Chat on WhatsApp</button>
              </a>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#9B9390", textAlign: "center", marginTop: 11 }}>Free consultation · Reply within 24hrs</div>
            </div>
          </div>
        </div>
      </>}
      {qOpen && <QuoteModal product={qP} onClose={() => { setQOpen(false); setQP(null); }} />}
    </div>
  );
}

/* ─── VISUALIZER ─── */
function Viz({ go }) {
  const [roomImg, setRoomImg] = useState(null);
  const [sp, setSp] = useState(null);
  const [sc, setSc] = useState(0);
  const [msgs, setMsgs] = useState([{ r: "ai", t: "Hi! I'm your IDEA room assistant. Upload a photo of your room and pick a piece from the left — I'll help you visualize it perfectly in your space." }]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState(null);
  const [qOpen, setQOpen] = useState(false);
  const fRef = useRef();
  const cRef = useRef();
  useEffect(() => { if (cRef.current) cRef.current.scrollTop = cRef.current.scrollHeight; }, [msgs]);

  const upload = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      setRoomImg(ev.target.result);
      setMsgs(p => [...p, { r: "user", t: "[Uploaded room photo]", img: ev.target.result }, { r: "ai", t: "Great space! Now pick a piece from the left panel and I'll tell you exactly how it would look and where to place it for maximum impact." }]);
    };
    r.readAsDataURL(f);
  };

  const send = async () => {
    if (!inp.trim() || loading) return;
    const u = inp; setInp("");
    setMsgs(p => [...p, { r: "user", t: u }]);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: `You are IDEA Furniture's room design assistant — a premium Lebanese furniture brand. Be warm, concise (2-3 sentences max), and design-savvy. ${sp ? `Customer is looking at: ${sp.name} in ${sp.colors[sc].n} (${sp.mat}), from $${sp.price.toLocaleString()}.` : ""} ${roomImg ? "They uploaded a room photo." : ""} Give specific advice about placement, scale, color harmony.`, messages: [...msgs.slice(-5).map(m => ({ role: m.r === "ai" ? "assistant" : "user", content: m.t })), { role: "user", content: u }] }) });
      const d = await res.json();
      setMsgs(p => [...p, { r: "ai", t: d.content?.map(c => c.text || "").join("") || "Tell me about your room and I'll give my best design advice!" }]);
    } catch { setMsgs(p => [...p, { r: "ai", t: "Tell me about your room dimensions and style — I'll give you my best placement advice!" }]); }
    setLoading(false);
  };

  const pick = p => {
    setSp(p); setSc(0); setPos({ x: 40, y: 45, s: 1 });
    setMsgs(prev => [...prev, { r: "ai", t: `The ${p.name} is a wonderful choice! ${roomImg ? "Based on your room, I'd position it as a focal point — the proportions make it a statement piece without overwhelming the space." : "Upload your room photo and I'll show you exactly how it fits."}` }]);
  };

  return (
    <div style={{ background: "#F4F1ED", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 62, background: "#1A1714", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0 }}>
        <button onClick={() => go("home")} style={{ background: "none", border: "none", cursor: "pointer" }}><span className="sf" style={{ fontSize: 21, color: "white", letterSpacing: ".18em", fontWeight: 300 }}>IDEA<span style={{ color: "#8B6F5C" }}>.</span></span></button>
        <span style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "rgba(255,255,255,.4)", letterSpacing: ".14em", textTransform: "uppercase" }}>✦ AI Room Visualizer</span>
        <div style={{ display: "flex", gap: 9 }}>
          {sp && <button className="b2" style={{ padding: "7px 16px", fontSize: 10 }} onClick={() => setQOpen(true)}>Request Quote</button>}
          <button className="b3" style={{ borderColor: "rgba(255,255,255,.18)", color: "rgba(255,255,255,.55)", padding: "7px 16px", fontSize: 10 }} onClick={() => go("catalog")}>← Catalog</button>
        </div>
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "240px 1fr 280px", overflow: "hidden" }}>
        <div style={{ borderRight: "1px solid rgba(26,23,20,.08)", overflowY: "auto", padding: "14px 0" }}>
          <div style={{ padding: "0 15px 10px", fontFamily: "'DM Sans'", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "#9B9390" }}>Select Furniture</div>
          {PRODUCTS.map(p => (
            <div key={p.id} className={`pi${sp?.id === p.id ? " on" : ""}`} onClick={() => pick(p)}>
              <div style={{ width: 44, height: 34, flexShrink: 0 }}><FurnitureSVG type={p.img} color={sp?.id === p.id ? "#8B6F5C" : "#C9B99A"} /></div>
              <div><div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: sp?.id === p.id ? 500 : 300, color: sp?.id === p.id ? "#1A1714" : "#5A5350" }}>{p.name}</div><div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#8B6F5C", marginTop: 1 }}>${p.price.toLocaleString()}</div></div>
            </div>
          ))}
        </div>
        <div style={{ position: "relative", background: "#DDD9D3", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {!roomImg ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>📷</div>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 15, color: "#7A736E", marginBottom: 5 }}>Upload your room photo</p>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#9B9390", marginBottom: 22 }}>JPG or PNG, up to 10MB</p>
              <button className="b2" onClick={() => fRef.current.click()}>Choose Photo</button>
              <input ref={fRef} type="file" accept="image/*" style={{ display: "none" }} onChange={upload} />
            </div>
          ) : (
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <img src={roomImg} alt="room" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {sp && pos && (
                <div style={{ position: "absolute", left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%,-50%)", width: `${150 * pos.s}px`, filter: "drop-shadow(0 8px 18px rgba(0,0,0,.44))", cursor: "move", opacity: .9 }}
                  onMouseDown={e => { const rect = e.currentTarget.parentElement.getBoundingClientRect(); const mv = ev => setPos(p => ({ ...p, x: ((ev.clientX - rect.left) / rect.width) * 100, y: ((ev.clientY - rect.top) / rect.height) * 100 })); const up = () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); }; window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up); }}>
                  <FurnitureSVG type={sp.img} color={sp.colors[sc].h} />
                </div>
              )}
              {sp && (
                <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, background: "rgba(26,23,20,.88)", backdropFilter: "blur(8px)", padding: "11px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div><span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "white" }}>{sp.name}</span><span style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "rgba(255,255,255,.38)", marginLeft: 8 }}>Drag to move</span></div>
                  <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                    {sp.colors.map((c,i) => <div key={i} onClick={() => setSc(i)} style={{ width: 16, height: 16, borderRadius: "50%", background: c.h, cursor: "pointer", boxShadow: sc===i ? "0 0 0 2px #8B6F5C" : "none", transition: "all .2s" }} />)}
                    <div style={{ width: 1, height: 16, background: "rgba(255,255,255,.15)", margin: "0 3px" }} />
                    {[.7,1,1.4].map((s,i) => <button key={i} onClick={() => setPos(p => ({ ...p, s }))} style={{ background: pos?.s===s ? "#8B6F5C" : "rgba(255,255,255,.1)", border: "none", color: "white", padding: "2px 8px", fontFamily: "'DM Sans'", fontSize: 10, cursor: "pointer" }}>{["S","M","L"][i]}</button>)}
                  </div>
                </div>
              )}
              <button onClick={() => fRef.current.click()} style={{ position: "absolute", top: 12, right: 12, background: "rgba(26,23,20,.7)", border: "none", color: "white", padding: "7px 12px", fontFamily: "'DM Sans'", fontSize: 10, cursor: "pointer" }}>📷 Change</button>
              <input ref={fRef} type="file" accept="image/*" style={{ display: "none" }} onChange={upload} />
            </div>
          )}
        </div>
        <div style={{ borderLeft: "1px solid rgba(26,23,20,.08)", display: "flex", flexDirection: "column", background: "white" }}>
          <div style={{ padding: "13px 15px 10px", borderBottom: "1px solid rgba(26,23,20,.06)", display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 28, height: 28, background: "#8B6F5C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: 12 }}>✦</span></div>
            <div><div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 500 }}>IDEA Assistant</div><div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#25D366" }}>● Online</div></div>
          </div>
          <div ref={cRef} style={{ flex: 1, overflowY: "auto", padding: "13px", display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.map((m,i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.r==="ai" ? "flex-start" : "flex-end" }}>
                {m.img && <img src={m.img} alt="room" style={{ width: 88, borderRadius: 5, marginBottom: 5, alignSelf: "flex-end" }} />}
                <div className={m.r === "ai" ? "aib" : "ub"}>{m.t}</div>
              </div>
            ))}
            {loading && <div style={{ display: "flex" }}><div className="aib" style={{ padding: "10px 13px" }}><div style={{ display: "flex", gap: 4 }}><div className="dot" /><div className="dot" style={{ animationDelay: ".2s" }} /><div className="dot" style={{ animationDelay: ".4s" }} /></div></div></div>}
          </div>
          <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(26,23,20,.06)" }}>
            <div style={{ display: "flex", gap: 6 }}>
              <input className="inp" placeholder="Ask about your space..." value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key==="Enter" && send()} style={{ flex: 1, fontSize: 12 }} />
              <button className="b2" style={{ padding: "9px 13px", fontSize: 10 }} onClick={send}>→</button>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 7, flexWrap: "wrap" }}>
              {["What size fits?","Color advice","Placement tips"].map(s => <button key={s} onClick={() => setInp(s)} style={{ background: "#F4F1ED", border: "1px solid rgba(26,23,20,.1)", padding: "3px 8px", fontFamily: "'DM Sans'", fontSize: 9, cursor: "pointer", color: "#7A736E" }}>{s}</button>)}
            </div>
          </div>
        </div>
      </div>
      {qOpen && <QuoteModal product={sp} onClose={() => setQOpen(false)} />}
    </div>
  );
}

/* ─── ADMIN ─── */
function Admin({ go, auth, setAuth }) {
  const [sec, setSec] = useState("dash");
  const [cr, setCr] = useState({ u: "", p: "" });
  const [err, setErr] = useState(false);
  const [quotes, setQuotes] = useState(QUOTES);
  const [sq, setSq] = useState(null);
  const login = () => { if (cr.u==="admin" && cr.p==="idea2024") { setAuth(true); setErr(false); } else setErr(true); };

  if (!auth) return (
    <div style={{ minHeight: "100vh", background: "#1A1714", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#F4F1ED", padding: "46px 42px", width: 360 }}>
        <div className="sf" style={{ fontSize: 26, marginBottom: 4 }}>IDEA<span style={{ color: "#8B6F5C" }}>.</span></div>
        <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".13em", textTransform: "uppercase", color: "#9B9390", marginBottom: 32 }}>Admin Access</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <input className="inp" placeholder="Username" value={cr.u} onChange={e => setCr({ ...cr, u: e.target.value })} />
          <input className="inp" type="password" placeholder="Password" value={cr.p} onChange={e => setCr({ ...cr, p: e.target.value })} onKeyDown={e => e.key==="Enter" && login()} />
          {err && <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#C0392B" }}>Try: admin / idea2024</div>}
          <button className="b1" style={{ width: "100%", justifyContent: "center", padding: 13 }} onClick={login}>Sign In</button>
        </div>
        <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#9B9390", marginTop: 16, textAlign: "center" }}>Demo: admin / idea2024</div>
        <button onClick={() => go("home")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: 11, color: "#9B9390", marginTop: 10, display: "block", width: "100%", textAlign: "center" }}>← Back to website</button>
      </div>
    </div>
  );

  const sb = { New:"#FEF3C7", "In Progress":"#DBEAFE", Quoted:"#D1FAE5", Closed:"#F3F4F6" };
  const sc2 = { New:"#92400E", "In Progress":"#1E40AF", Quoted:"#065F46", Closed:"#6B7280" };
  const upd = (id, s) => { setQuotes(p => p.map(q => q.id===id ? { ...q, status:s } : q)); setSq(p => p ? { ...p, status:s } : p); };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F4F1ED" }}>
      <div style={{ width: 220, background: "#1A1714", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "22px 18px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <div className="sf" style={{ fontSize: 20, color: "white", letterSpacing: ".16em" }}>IDEA<span style={{ color: "#8B6F5C" }}>.</span></div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 9, color: "rgba(255,255,255,.3)", marginTop: 2 }}>Admin Dashboard</div>
        </div>
        <div style={{ flex: 1, padding: "16px 9px" }}>
          {[["dash","🗂 Dashboard"],["quotes","📋 Quotes"],["products","🪑 Products"],["analytics","📊 Analytics"]].map(([id,lbl]) => (
            <div key={id} className={`an${sec===id?" on":""}`} onClick={() => setSec(id)}>{lbl}</div>
          ))}
        </div>
        <div style={{ padding: "14px 9px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
          <div className="an" onClick={() => go("home")}>👁 View Website</div>
          <div className="an" onClick={() => setAuth(false)}>↩ Sign Out</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
        {sec === "dash" && (
          <div>
            <h1 className="sf" style={{ fontSize: 30, fontWeight: 300, marginBottom: 6 }}>Good morning 👋</h1>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#7A736E", marginBottom: 28 }}>Here's what's happening with IDEA today.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
              {[["Total Quotes",quotes.length,"This month"],["New",quotes.filter(q=>q.status==="New").length,"Awaiting reply"],["In Progress",quotes.filter(q=>q.status==="In Progress").length,"Active"],["Revenue","$54,200","Pipeline"]].map(([l,v,s],i) => (
                <div key={i} className="stat"><div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#9B9390", marginBottom: 6 }}>{l}</div><div className="sf" style={{ fontSize: 30, fontWeight: 300 }}>{v}</div><div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8B6F5C", marginTop: 4 }}>{s}</div></div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "white", padding: "22px 26px" }}>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#9B9390", marginBottom: 18 }}>Recent Quotes</div>
                {quotes.map(q => (
                  <div key={q.id} onClick={() => { setSq(q); setSec("quotes"); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F4F1ED", cursor: "pointer" }}>
                    <div><div style={{ fontFamily: "'DM Sans'", fontSize: 13 }}>{q.name}</div><div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#9B9390", marginTop: 1 }}>{q.product}</div></div>
                    <div style={{ display: "flex", gap: 7, alignItems: "center" }}><span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8B6F5C" }}>{q.budget}</span><span style={{ background: sb[q.status], color: sc2[q.status], fontSize: 9, letterSpacing: ".09em", textTransform: "uppercase", padding: "2px 7px", fontFamily: "'DM Sans'" }}>{q.status}</span></div>
                  </div>
                ))}
              </div>
              <div style={{ background: "white", padding: "22px 26px" }}>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#9B9390", marginBottom: 18 }}>Top Products</div>
                {[["Arc Sofa",42],["Slab Table",31],["Zen Bed",28],["Focus Desk",19]].map(([n,p]) => (
                  <div key={n} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontFamily: "'DM Sans'", fontSize: 12 }}>{n}</span><span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8B6F5C" }}>{p}%</span></div>
                    <div style={{ height: 4, background: "#F4F1ED", borderRadius: 2 }}><div style={{ height: 4, background: "#8B6F5C", borderRadius: 2, width: `${p}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {sec === "quotes" && (
          <div style={{ display: "grid", gridTemplateColumns: sq ? "1fr 340px" : "1fr", gap: 18 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h1 className="sf" style={{ fontSize: 28, fontWeight: 300 }}>Quote Requests</h1>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#9B9390" }}>{quotes.length} total</span>
              </div>
              {quotes.map(q => (
                <div key={q.id} className={`qrow${sq?.id===q.id?" on":""}`} onClick={() => setSq(q)}>
                  <div>
                    <div style={{ display: "flex", gap: 9, alignItems: "center" }}><span style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 500 }}>{q.name}</span><span style={{ background: sb[q.status], color: sc2[q.status], fontSize: 9, letterSpacing: ".09em", textTransform: "uppercase", padding: "2px 7px", fontFamily: "'DM Sans'" }}>{q.status}</span></div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#7A736E", marginTop: 3 }}>{q.product} · {q.color} · {q.size}</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#9B9390", marginTop: 2 }}>{q.msg}</div>
                  </div>
                  <div style={{ textAlign: "right" }}><div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8B6F5C" }}>{q.budget}</div><div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#9B9390", marginTop: 2 }}>{q.date}</div></div>
                </div>
              ))}
            </div>
            {sq && (
              <div style={{ background: "white", padding: "24px 24px", position: "sticky", top: 0, alignSelf: "start" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                  <div><div className="sf" style={{ fontSize: 20 }}>{sq.name}</div><div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#9B9390", marginTop: 2 }}>{sq.id} · {sq.date}</div></div>
                  <button onClick={() => setSq(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9B9390", fontSize: 18 }}>×</button>
                </div>
                {[["Product",sq.product],["Finish",sq.color],["Size",sq.size],["Budget",sq.budget],["Email",sq.email],["Phone",sq.phone]].map(([k,v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".07em", textTransform: "uppercase", color: "#9B9390" }}>{k}</span><span style={{ fontFamily: "'DM Sans'", fontSize: 12 }}>{v}</span></div>
                ))}
                <div style={{ background: "#FAF8F5", padding: "10px 12px", margin: "14px 0" }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 9, letterSpacing: ".07em", textTransform: "uppercase", color: "#9B9390", marginBottom: 4 }}>Message</div>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#5A5350", lineHeight: 1.6 }}>{sq.msg}</p>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 9, letterSpacing: ".07em", textTransform: "uppercase", color: "#9B9390", marginBottom: 7 }}>Update Status</div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {["New","In Progress","Quoted","Closed"].map(s => <button key={s} className={`stb${sq.status===s?" on":""}`} onClick={() => upd(sq.id, s)}>{s}</button>)}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <a href={`https://wa.me/${sq.phone.replace(/\D/g,"")}?text=${encodeURIComponent(`Hi ${sq.name}! This is IDEA Furniture. Thank you for your interest in the ${sq.product}. We'd love to discuss your project!`)}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                    <button className="b2" style={{ width: "100%", justifyContent: "center", padding: 11 }}>💬 Reply on WhatsApp</button>
                  </a>
                  <a href={`mailto:${sq.email}?subject=Your IDEA Quote Request`} style={{ textDecoration: "none" }}>
                    <button className="b3" style={{ width: "100%", justifyContent: "center", padding: 10 }}>✉ Send Email</button>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {sec === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h1 className="sf" style={{ fontSize: 28, fontWeight: 300 }}>Products</h1>
              <button className="b1">+ Add Product</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
              {PRODUCTS.map(p => (
                <div key={p.id} style={{ background: "white", overflow: "hidden" }}>
                  <div style={{ height: 150, background: "#FAF8F5", display: "flex", alignItems: "center", justifyContent: "center", padding: 26 }}><FurnitureSVG type={p.img} color="#8B6F5C" /></div>
                  <div style={{ padding: "12px 16px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                      <span className="sf" style={{ fontSize: 16 }}>{p.name}</span>
                      <span style={{ background: p.tag==="New"?"#DBEAFE":p.tag==="Bestseller"?"#D1FAE5":"#FEF3C7", color: p.tag==="New"?"#1E40AF":p.tag==="Bestseller"?"#065F46":"#92400E", fontSize: 9, letterSpacing: ".09em", textTransform: "uppercase", padding: "2px 7px", fontFamily: "'DM Sans'" }}>{p.tag}</span>
                    </div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#9B9390" }}>{p.cat} · {p.mat}</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8B6F5C", marginTop: 5 }}>From ${p.price.toLocaleString()}</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 7 }}>{p.colors.map((c,i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c.h }} />)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {sec === "analytics" && (
          <div>
            <h1 className="sf" style={{ fontSize: 28, fontWeight: 300, marginBottom: 24 }}>Analytics</h1>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { title:"Monthly Quotes", content: [["Oct",12,29],["Nov",16,39],["Dec",21,51],["Jan",28,68]].map(([m,n,w]) => (
                  <div key={m} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#9B9390", width: 26 }}>{m}</span><div style={{ flex: 1, height: 5, background: "#F4F1ED", borderRadius: 2 }}><div style={{ height: 5, background: "#8B6F5C", borderRadius: 2, width: `${w}%` }} /></div><span style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 500, width: 18 }}>{n}</span></div>
                ))},
                { title:"Categories", content: [["Living Room",38,"#8B6F5C"],["Bedroom",27,"#C9B99A"],["Dining",22,"#6B6460"],["Office",13,"#D8D2CB"]].map(([c,p,col]) => (
                  <div key={c} style={{ marginBottom: 14 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span style={{ fontFamily: "'DM Sans'", fontSize: 12 }}>{c}</span><span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#8B6F5C" }}>{p}%</span></div><div style={{ height: 4, background: "#F4F1ED", borderRadius: 2 }}><div style={{ height: 4, background: col, borderRadius: 2, width: `${p}%` }} /></div></div>
                ))},
                { title:"Traffic Sources", content: [["Direct","40%"],["Instagram","31%"],["Google","18%"],["WhatsApp","11%"]].map(([s,p]) => (
                  <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #F4F1ED" }}><span style={{ fontFamily: "'DM Sans'", fontSize: 12 }}>{s}</span><span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8B6F5C", fontWeight: 500 }}>{p}</span></div>
                ))},
                { title:"Revenue Pipeline", content: [["New","$14,200"],["In Progress","$28,400"],["Quoted","$11,800"],["Total","$54,400"]].map(([l,v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F4F1ED" }}><span style={{ fontFamily: "'DM Sans'", fontSize: 12 }}>{l}</span><span className="sf" style={{ fontSize: 17, fontWeight: 300, color: "#8B6F5C" }}>{v}</span></div>
                ))},
              ].map((card,i) => (
                <div key={i} style={{ background: "white", padding: "22px 26px" }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#9B9390", marginBottom: 18 }}>{card.title}</div>
                  {card.content}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── QUOTE MODAL ─── */
function QuoteModal({ product, onClose }) {
  const [f, setF] = useState({ name:"", email:"", phone:"", size:"", msg:"" });
  const [done, setDone] = useState(false);
  const u = (k,v) => setF(p => ({ ...p, [k]:v }));
  const submit = () => { if (f.name && f.email) setDone(true); };
  const wa = () => { const m = encodeURIComponent(`Hi IDEA Furniture! Quote request for: ${product ? product.name : "custom piece"}.\nName: ${f.name}\nPhone: ${f.phone}\nDetails: ${f.msg}`); window.open(`https://wa.me/96100000000?text=${m}`, "_blank"); };
  return (
    <>
      <div className="ov" onClick={onClose} />
      <div className="qmo">
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "#9B9390", fontSize: 22 }}>×</button>
        {!done ? <>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 9, letterSpacing: ".18em", color: "#8B6F5C", textTransform: "uppercase", marginBottom: 10 }}>Free Quote</div>
          <h2 className="sf" style={{ fontSize: 28, fontWeight: 300, marginBottom: 4 }}>{product ? product.name : "Request a Quote"}</h2>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#9B9390", marginBottom: 30, lineHeight: 1.6 }}>Tell us about your project. We reply within 24 hours.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <input className="inp" placeholder="Full name *" value={f.name} onChange={e => u("name", e.target.value)} />
            <input className="inp" placeholder="Email address *" value={f.email} onChange={e => u("email", e.target.value)} />
            <input className="inp" placeholder="Phone / WhatsApp" value={f.phone} onChange={e => u("phone", e.target.value)} />
            {product && <div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 9, letterSpacing: ".09em", textTransform: "uppercase", color: "#9B9390", marginBottom: 7 }}>Size</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{product.sizes.map((s,i) => <button key={i} className={`szb${f.size===s?" on":""}`} onClick={() => u("size",s)}>{s}</button>)}</div>
            </div>}
            <textarea className="inp" placeholder="Tell us about your project..." rows={3} style={{ resize: "vertical" }} value={f.msg} onChange={e => u("msg", e.target.value)} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="b1" style={{ width: "100%", justifyContent: "center", padding: 13 }} onClick={submit}>Send Quote Request</button>
              <button className="b3" style={{ width: "100%", justifyContent: "center", padding: 11 }} onClick={wa}>💬 Or message on WhatsApp</button>
            </div>
          </div>
        </> : (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ width: 56, height: 56, background: "#8B6F5C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 22 }}>✓</div>
            <h2 className="sf" style={{ fontSize: 26, fontWeight: 300, marginBottom: 10 }}>Request Sent!</h2>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#7A736E", lineHeight: 1.75, marginBottom: 8 }}>Thank you, {f.name}.<br />We'll reach out within 24 hours.</p>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#9B9390", marginBottom: 28 }}>Can't wait? Message us directly.</p>
            <div style={{ display: "flex", gap: 9, justifyContent: "center" }}>
              <button className="b2" onClick={wa}>💬 WhatsApp</button>
              <button className="b3" onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
