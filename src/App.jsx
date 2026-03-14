import { useState, useRef } from "react";

const BINDING = [
  { id: "none", name: "No Binding", price: 0, icon: "📋" },
  { id: "spiral", name: "Spiral", price: 25, icon: "🔗" },
  { id: "staple", name: "Staple", price: 10, icon: "📌" },
  { id: "perfect", name: "Perfect Bind", price: 60, icon: "📖" },
  { id: "hardcover", name: "Hardcover", price: 150, icon: "📕" },
];

/* ── Pill ── */
function Pill({ label, active, onClick }) {
  return <button onClick={onClick} style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1.5px solid ${active ? "#FF6B35" : "#e0e0e0"}`, background: active ? "#FFF3ED" : "#fff", color: active ? "#FF6B35" : "#555", whiteSpace: "nowrap" }}>{label}</button>;
}

/* ── Stepper ── */
function Stepper({ value, onChange, label, sub }) {
  const v = parseInt(value) || 1;
  const btn = (txt, click, disabled) => (
    <button onClick={click} disabled={disabled} style={{ width: 32, border: "none", background: disabled ? "#f5f5f5" : "#FFF3ED", color: disabled ? "#ccc" : "#FF6B35", fontSize: 15, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0, height: "100%" }}>{txt}</button>
  );
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 4 }}>{label}{sub && <span style={{ color: "#16a34a" }}> {sub}</span>}</label>
      <div style={{ display: "flex", border: "1.5px solid #e0e0e0", borderRadius: 8, overflow: "hidden", height: 36 }}>
        {btn("−", () => onChange(Math.max(1, v - 1)), v <= 1)}
        <input type="number" inputMode="numeric" min="1" value={value}
          onChange={e => { const x = e.target.value; onChange(x === "" ? "" : Math.max(1, parseInt(x) || 1)); }}
          onBlur={() => { if (!value || value < 1) onChange(1); }}
          style={{ flex: 1, border: "none", borderLeft: "1px solid #e0e0e0", borderRight: "1px solid #e0e0e0", textAlign: "center", fontWeight: 600, outline: "none", minWidth: 0, padding: 0, background: "transparent" }} />
        {btn("+", () => onChange(v + 1), false)}
      </div>
    </div>
  );
}

/* ── ProgressBar ── */
function ProgressBar({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
      {["Upload", "Address", "Payment", "Done"].map((s, i) => (
        <div key={s} style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: i <= step ? "linear-gradient(135deg,#FF6B35,#FF8C42)" : "#eee", color: i <= step ? "#fff" : "#bbb" }}>{i + 1}</div>
            <span style={{ fontSize: 9, marginTop: 2, color: i <= step ? "#FF6B35" : "#bbb", fontWeight: 500 }}>{s}</span>
          </div>
          {i < 3 && <div style={{ flex: 1, height: 2, background: i < step ? "#FF6B35" : "#eee", marginBottom: 14 }} />}
        </div>
      ))}
    </div>
  );
}

/* ══════ NAVBAR ══════ */
function Navbar({ user, setPage, page, onSignOut }) {
  const [open, setOpen] = useState(false);
  const go = p => { setPage(p); setOpen(false); };
  const items = [{ k: "home", l: "Home", i: "🏠" }, { k: "orders", l: "My Orders", i: "📦" }, { k: "account", l: "My Account", i: "👤" }, { k: "about", l: "About Us", i: "ℹ️" }, { k: "contact", l: "Contact Us", i: "📞" }];
  return (
    <>
      <style>{`@media(min-width:769px){.mob-burger{display:none!important}} @media(max-width:768px){.desk-nav{display:none!important}}`}</style>
      <nav style={{ background: "#fff", borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 50, width: "100%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px" }}>
          <button onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 8, border: "none", background: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#FF6B35,#FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>P</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", fontFamily: "'DM Serif Display',Georgia,serif" }}>PrintKaaro</span>
          </button>
          <div className="desk-nav" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {items.slice(0, 3).map(p => <button key={p.k} onClick={() => go(p.k)} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", background: page === p.k ? "#FFF3ED" : "transparent", color: page === p.k ? "#FF6B35" : "#666" }}>{p.l}</button>)}
            {user ? <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 4 }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 600 }}>{user.name[0].toUpperCase()}</div><span style={{ fontSize: 12, color: "#333" }}>{user.name}</span></div>
              : <button onClick={() => go("signin")} style={{ marginLeft: 4, padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, border: "2px solid #FF6B35", background: "#fff", color: "#FF6B35", cursor: "pointer" }}>Sign In</button>}
          </div>
          <button className="mob-burger" onClick={() => setOpen(!open)} style={{ display: "flex", border: "none", background: "none", cursor: "pointer", padding: 6, flexDirection: "column", gap: 4, flexShrink: 0 }}>
            <span style={{ display: "block", width: 20, height: 2, background: open ? "#FF6B35" : "#333", transition: "all .2s", transform: open ? "rotate(45deg) translate(4px,4px)" : "none" }} />
            <span style={{ display: "block", width: 20, height: 2, background: "#333", transition: "all .2s", opacity: open ? 0 : 1 }} />
            <span style={{ display: "block", width: 20, height: 2, background: open ? "#FF6B35" : "#333", transition: "all .2s", transform: open ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
          </button>
        </div>
      </nav>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 60 }} />}
      <div style={{ position: "fixed", top: 0, right: 0, width: 250, height: "100%", background: "#fff", zIndex: 70, transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .25s", boxShadow: open ? "-4px 0 20px rgba(0,0,0,.08)" : "none", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 14px", borderBottom: "1px solid #f0f0f0" }}>
          {user ? <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{user.name[0].toUpperCase()}</div><div><div style={{ fontSize: 14, fontWeight: 700 }}>{user.name}</div><div style={{ fontSize: 11, color: "#999" }}>{user.phone}</div></div></div>
            : <button onClick={() => go("signin")} style={{ width: "100%", padding: 10, borderRadius: 8, border: "none", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Sign In</button>}
        </div>
        <div style={{ flex: 1, padding: "4px 0" }}>
          {items.map(it => <button key={it.k} onClick={() => go(it.k)} style={{ width: "100%", padding: "11px 14px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 500, textAlign: "left", background: page === it.k ? "#FFF3ED" : "#fff", color: page === it.k ? "#FF6B35" : "#444", borderLeft: page === it.k ? "3px solid #FF6B35" : "3px solid transparent" }}><span>{it.i}</span>{it.l}</button>)}
        </div>
        {user && <div style={{ padding: "12px 14px", borderTop: "1px solid #f0f0f0" }}><button onClick={() => { onSignOut(); setOpen(false); }} style={{ width: "100%", padding: 9, borderRadius: 8, border: "1.5px solid #ef4444", background: "#fff", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Sign Out</button></div>}
      </div>
    </>
  );
}

/* ══════ AUTH ══════ */
function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const go = () => { setErr(""); if (mode === "signup" && !name.trim()) return setErr("Enter name"); if (phone.length < 10) return setErr("Valid phone needed"); if (pw.length < 4) return setErr("Min 4 chars"); onAuth({ name: name || phone, email, phone, id: Date.now() }); };
  const i = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e0e0e0", outline: "none", boxSizing: "border-box" };
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "linear-gradient(135deg,#FFF9F5,#FFF0E8)" }}>
      <div style={{ width: "100%", maxWidth: 380, background: "#fff", borderRadius: 16, padding: "28px 22px", boxShadow: "0 12px 40px rgba(255,107,53,.06)" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#FF6B35,#FF8C42)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 10 }}>P</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{mode === "signin" ? "Welcome Back" : "Create Account"}</h2>
          <p style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{mode === "signin" ? "Sign in to continue" : "Join PrintKaaro"}</p>
        </div>
        {mode === "signup" && <><label style={{ fontSize: 10, fontWeight: 600, color: "#888", display: "block", marginBottom: 3 }}>NAME</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ ...i, marginBottom: 10 }} /></>}
        <label style={{ fontSize: 10, fontWeight: 600, color: "#888", display: "block", marginBottom: 3 }}>PHONE</label>
        <div style={{ display: "flex", border: "1.5px solid #e0e0e0", borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
          <span style={{ padding: "10px 8px", background: "#f8f8f8", fontSize: 13, color: "#666", borderRight: "1px solid #e0e0e0" }}>+91</span>
          <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" style={{ flex: 1, padding: "10px", border: "none", outline: "none", minWidth: 0 }} />
        </div>
        {mode === "signup" && <><label style={{ fontSize: 10, fontWeight: 600, color: "#888", display: "block", marginBottom: 3 }}>EMAIL</label><input value={email} onChange={e => setEmail(e.target.value)} placeholder="Optional" style={{ ...i, marginBottom: 10 }} /></>}
        <label style={{ fontSize: 10, fontWeight: 600, color: "#888", display: "block", marginBottom: 3 }}>PASSWORD</label>
        <input value={pw} onChange={e => setPw(e.target.value)} type="password" placeholder="Password" style={{ ...i, marginBottom: 14 }} />
        {err && <p style={{ color: "#e53e3e", fontSize: 12, marginBottom: 8, textAlign: "center" }}>{err}</p>}
        <button onClick={go} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{mode === "signin" ? "Sign In" : "Sign Up"}</button>
        <p style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#888" }}>{mode === "signin" ? "No account? " : "Have account? "}<button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(""); }} style={{ color: "#FF6B35", fontWeight: 600, border: "none", background: "none", cursor: "pointer" }}>{mode === "signin" ? "Sign Up" : "Sign In"}</button></p>
      </div>
    </div>
  );
}

/* ══════ HOME ══════ */
function HomePage({ onProceed }) {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState(1);
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState("bw");
  const [paper, setPaper] = useState("A4");
  const [sided, setSided] = useState("single");
  const [bind, setBind] = useState("none");
  const [drag, setDrag] = useState(false);
  const ref = useRef();
  const ppp = color === "bw" ? 2 : color === "color" ? 8 : 5;
  const sm = sided === "double" ? 0.7 : 1;
  const bo = BINDING.find(b => b.id === bind);
  const sub = Math.ceil(ppp * sm * pages * copies + (bo?.price || 0) * copies);
  const del = sub >= 500 ? 0 : 40;

  const handleFile = f => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      const r = new FileReader();
      r.onload = e => { const s = new TextDecoder("latin1").decode(new Uint8Array(e.target.result)); const m = s.match(/\/Type\s*\/Page[^s]/g); setPages(Math.max(1, m ? m.length : Math.ceil(f.size / 30000) || 1)); };
      r.readAsArrayBuffer(f);
    }
  };

  return (
    <div style={{ background: "linear-gradient(180deg,#FFF9F5 0%,#FFF 40%)", minHeight: "80vh", width: "100%" }}>
      <style>{`@media(min-width:769px){.pk-home-grid{flex-direction:row!important} .pk-sidebar{flex:0 0 300px!important;position:sticky!important;top:70px}}`}</style>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "28px 16px 12px" }}>
        <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 14, fontSize: 10, fontWeight: 600, background: "#FFF3ED", color: "#FF6B35", marginBottom: 10 }}>UPLOAD → CONFIGURE → PAY → DELIVERED</div>
        <h1 style={{ fontSize: "clamp(24px, 6vw, 38px)", fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px", lineHeight: 1.2, fontFamily: "'DM Serif Display',Georgia,serif" }}>
          Get Your Documents<br /><span style={{ background: "linear-gradient(135deg,#FF6B35,#FF8C42)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Printed & Delivered</span>
        </h1>
        <p style={{ fontSize: 13, color: "#888", maxWidth: 400, margin: "0 auto" }}>Upload PDF, choose options, pay online. Delivered to your doorstep.</p>
      </div>

      {/* Main Grid - column on mobile, row on desktop */}
      <div className="pk-home-grid" style={{ maxWidth: 900, margin: "0 auto", padding: "0 12px 40px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Left: Upload + Options */}
        <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
          {/* Upload Zone */}
          <div onClick={() => ref.current?.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
            style={{ border: `2px dashed ${drag ? "#FF6B35" : file ? "#22c55e" : "#d0d0d0"}`, borderRadius: 10, padding: file ? "12px" : "20px 12px", textAlign: "center", cursor: "pointer", background: drag ? "#FFF8F4" : file ? "#F0FDF4" : "#FAFAFA", marginBottom: 12, width: "100%", boxSizing: "border-box" }}>
            <input ref={ref} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            {file ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
                <span style={{ fontSize: 22 }}>✅</span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#16a34a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                  <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{(file.size / 1024).toFixed(0)}KB &bull; {pages} pages &bull; tap to change</p>
                </div>
              </div>
            ) : (
              <><div style={{ fontSize: 28, marginBottom: 2 }}>📄</div><p style={{ fontSize: 14, fontWeight: 600, color: "#333", margin: 0 }}>Drop your PDF here</p><p style={{ fontSize: 11, color: "#999", margin: "2px 0 0" }}>or tap to browse &bull; Max 50MB</p></>
            )}
          </div>

          {/* Options Card */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "16px 14px", border: "1px solid #eee", width: "100%", boxSizing: "border-box" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", margin: "0 0 12px" }}>Print Options</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: "#999", display: "block", marginBottom: 5 }}>PRINT TYPE</label>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                <Pill label="B&W ₹2/pg" active={color === "bw"} onClick={() => setColor("bw")} />
                <Pill label="Color ₹8/pg" active={color === "color"} onClick={() => setColor("color")} />
                <Pill label="Booklet ₹5/pg" active={color === "booklet"} onClick={() => setColor("booklet")} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: "#999", display: "block", marginBottom: 5 }}>PAPER SIZE</label>
              <div style={{ display: "flex", gap: 5 }}>
                {["A4", "A3", "Legal", "A5"].map(s => <Pill key={s} label={s} active={paper === s} onClick={() => setPaper(s)} />)}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: "#999", display: "block", marginBottom: 5 }}>PRINT SIDE</label>
              <div style={{ display: "flex", gap: 5 }}>
                <Pill label="Single Side" active={sided === "single"} onClick={() => setSided("single")} />
                <Pill label="Both Sides (−30%)" active={sided === "double"} onClick={() => setSided("double")} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <Stepper value={pages} onChange={setPages} label="PAGES" sub={file ? "(auto)" : ""} />
              <Stepper value={copies} onChange={setCopies} label="COPIES" />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 600, color: "#999", display: "block", marginBottom: 5 }}>BINDING</label>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {BINDING.map(b => <Pill key={b.id} label={`${b.icon} ${b.name}${b.price ? ` +₹${b.price}` : ""}`} active={bind === b.id} onClick={() => setBind(b.id)} />)}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Summary */}
        <div className="pk-sidebar" style={{ width: "100%" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "16px 14px", border: "1px solid #eee", width: "100%", boxSizing: "border-box" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", margin: "0 0 10px" }}>Order Summary</h3>
            {file ? (<>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#F0FDF4", borderRadius: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 14 }}>📄</span>
                <div style={{ minWidth: 0 }}><p style={{ fontSize: 12, fontWeight: 600, color: "#333", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p><p style={{ fontSize: 10, color: "#888", margin: 0 }}>{pages}p &bull; {copies}c &bull; {paper} &bull; {color === "bw" ? "B&W" : "Color"}</p></div>
              </div>
              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 8, fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: "#666" }}><span>Printing</span><span style={{ fontWeight: 600, color: "#333" }}>₹{Math.ceil(ppp * sm * pages * copies)}</span></div>
                {bo.price > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: "#666" }}><span>{bo.name} ×{copies}</span><span style={{ fontWeight: 600, color: "#333" }}>₹{bo.price * copies}</span></div>}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: "#666" }}><span>Delivery</span><span style={{ fontWeight: 600, color: del === 0 ? "#16a34a" : "#333" }}>{del === 0 ? "FREE" : `₹${del}`}</span></div>
              </div>
              <div style={{ borderTop: "2px solid #FF6B35", paddingTop: 8, marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#FF6B35" }}>₹{sub + del}</span>
              </div>
            </>) : (
              <div style={{ textAlign: "center", padding: "10px 0", color: "#ccc" }}><div style={{ fontSize: 24 }}>📄</div><p style={{ fontSize: 11, margin: "4px 0 0" }}>Upload PDF to see pricing</p></div>
            )}
            <button onClick={() => { if (file) onProceed({ file: file.name, pages, copies, colorMode: color, paperSize: paper, sided, binding: bo.name, price: sub }); }} disabled={!file}
              style={{ width: "100%", padding: 11, borderRadius: 10, border: "none", marginTop: 10, background: file ? "linear-gradient(135deg,#FF6B35,#FF8C42)" : "#e0e0e0", color: file ? "#fff" : "#999", fontSize: 14, fontWeight: 700, cursor: file ? "pointer" : "not-allowed" }}>
              {file ? "Proceed to Checkout →" : "Upload PDF first"}
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
            {[{ i: "⚡", t: "24hr Turnaround" }, { i: "🔒", t: "Secure Files" }, { i: "📱", t: "UPI/Razorpay" }, { i: "🚚", t: "Home Delivery" }].map(x => (
              <div key={x.t} style={{ background: "#fff", borderRadius: 8, padding: "7px 8px", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 12 }}>{x.i}</span><span style={{ fontSize: 10, color: "#888" }}>{x.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════ ADDRESS ══════ */
function AddressPage({ onConfirm, onBack }) {
  const [n, sN] = useState(""); const [ph, sPh] = useState(""); const [ad, sAd] = useState("");
  const [ci, sCi] = useState(""); const [pin, sPin] = useState(""); const [no, sNo] = useState("");
  const ok = n && ph.length >= 10 && ad && ci && pin.length >= 6;
  const i = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e0e0e0", outline: "none", boxSizing: "border-box" };
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px" }}>
      <button onClick={onBack} style={{ border: "none", background: "none", color: "#888", fontSize: 13, cursor: "pointer", marginBottom: 14 }}>← Back</button>
      <ProgressBar step={1} />
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: "0 0 3px", fontFamily: "'DM Serif Display',Georgia,serif" }}>Delivery Address</h2>
      <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Where should we deliver?</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 10, fontWeight: 600, color: "#999", display: "block", marginBottom: 3 }}>NAME</label><input value={n} onChange={e => sN(e.target.value)} placeholder="Full name" style={i} /></div>
        <div><label style={{ fontSize: 10, fontWeight: 600, color: "#999", display: "block", marginBottom: 3 }}>PHONE</label><input value={ph} onChange={e => sPh(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" style={i} /></div>
        <div><label style={{ fontSize: 10, fontWeight: 600, color: "#999", display: "block", marginBottom: 3 }}>PINCODE</label><input value={pin} onChange={e => sPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="733101" style={i} /></div>
        <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 10, fontWeight: 600, color: "#999", display: "block", marginBottom: 3 }}>ADDRESS</label><textarea value={ad} onChange={e => sAd(e.target.value)} rows={2} placeholder="House, Street, Locality" style={{ ...i, resize: "none" }} /></div>
        <div><label style={{ fontSize: 10, fontWeight: 600, color: "#999", display: "block", marginBottom: 3 }}>CITY</label><input value={ci} onChange={e => sCi(e.target.value)} placeholder="Balurghat" style={i} /></div>
        <div><label style={{ fontSize: 10, fontWeight: 600, color: "#999", display: "block", marginBottom: 3 }}>STATE</label><input value="West Bengal" disabled style={{ ...i, background: "#f8f8f8", color: "#666" }} /></div>
        <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 10, fontWeight: 600, color: "#999", display: "block", marginBottom: 3 }}>NOTES</label><input value={no} onChange={e => sNo(e.target.value)} placeholder="Optional instructions" style={i} /></div>
      </div>
      <button onClick={() => ok && onConfirm({ name: n, phone: ph, address: ad, city: ci, pincode: pin, notes: no })} disabled={!ok}
        style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", marginTop: 16, background: ok ? "linear-gradient(135deg,#FF6B35,#FF8C42)" : "#e0e0e0", color: ok ? "#fff" : "#999", fontSize: 15, fontWeight: 700, cursor: ok ? "pointer" : "not-allowed" }}>Proceed to Payment →</button>
    </div>
  );
}

/* ══════ PAYMENT ══════ */
function PaymentPage({ order, onPay, onBack }) {
  const [m, setM] = useState("upi");
  const d = order.price >= 500 ? 0 : 40;
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px" }}>
      <button onClick={onBack} style={{ border: "none", background: "none", color: "#888", fontSize: 13, cursor: "pointer", marginBottom: 14 }}>← Back</button>
      <ProgressBar step={2} />
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: "0 0 3px", fontFamily: "'DM Serif Display',Georgia,serif" }}>Payment</h2>
      <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Choose payment method</p>
      <div style={{ background: "#FFFAF7", borderRadius: 10, padding: 14, border: "1px solid #FFE8D9", marginBottom: 14, fontSize: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#666", marginBottom: 4 }}><span>📄 {order.file}</span><span style={{ fontWeight: 600, color: "#333" }}>{order.pages}p × {order.copies}c</span></div>
        <div style={{ borderTop: "1px dashed #FFD5BE", paddingTop: 8, marginTop: 6, display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 14, fontWeight: 700 }}>Total</span><span style={{ fontSize: 20, fontWeight: 800, color: "#FF6B35" }}>₹{order.price + d}</span></div>
      </div>
      {[{ id: "upi", icon: "📱", l: "UPI (GPay / PhonePe)", d: "Instant payment" }, { id: "razorpay", icon: "💳", l: "Card / Netbanking", d: "Via Razorpay" }].map(x => (
        <button key={x.id} onClick={() => setM(x.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, cursor: "pointer", border: `2px solid ${m === x.id ? "#FF6B35" : "#eee"}`, background: m === x.id ? "#FFF8F4" : "#fff", textAlign: "left", marginBottom: 6, boxSizing: "border-box" }}>
          <span style={{ fontSize: 20 }}>{x.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: 13, fontWeight: 600, color: "#333", margin: 0 }}>{x.l}</p><p style={{ fontSize: 11, color: "#999", margin: 0 }}>{x.d}</p></div>
          <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${m === x.id ? "#FF6B35" : "#ddd"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{m === x.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF6B35" }} />}</div>
        </button>
      ))}
      <button onClick={() => onPay(m)} style={{ width: "100%", padding: 13, borderRadius: 10, border: "none", marginTop: 8, background: m === "upi" ? "linear-gradient(135deg,#059669,#10b981)" : "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Pay ₹{order.price + d}</button>
      <p style={{ textAlign: "center", fontSize: 10, color: "#bbb", marginTop: 6 }}>🔒 Secured by Razorpay</p>
    </div>
  );
}

/* ══════ ORDER STATUS ══════ */
function StatusPage({ order, address, setPage }) {
  const id = `#PK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`;
  const d = order.price >= 500 ? 0 : 40;
  const steps = [{ l: "Order Placed", t: "Just now", ok: true, i: "✅" }, { l: "Payment Confirmed", t: "Just now", ok: true, i: "💳" }, { l: "Printing", t: "Est. 2-4 hrs", ok: false, i: "🖨️" }, { l: "Ready", ok: false, i: "📦" }, { l: "Delivery", ok: false, i: "🚚" }, { l: "Delivered", ok: false, i: "🏠" }];
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px" }}>
      <ProgressBar step={3} />
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#fff", marginBottom: 10 }}>✓</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 2px", fontFamily: "'DM Serif Display',Georgia,serif" }}>Order Confirmed!</h2>
        <p style={{ fontSize: 12, color: "#888" }}>{id}</p>
      </div>
      <div style={{ background: "#fff", borderRadius: 10, padding: 14, border: "1px solid #eee", marginBottom: 12, fontSize: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ color: "#888" }}>File</span><span style={{ fontWeight: 600 }}>{order.file}</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ color: "#888" }}>Deliver to</span><span style={{ textAlign: "right", maxWidth: 200 }}>{address.city} - {address.pincode}</span></div>
        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 6, marginTop: 6, display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700 }}>Total</span><span style={{ fontSize: 16, fontWeight: 800, color: "#FF6B35" }}>₹{order.price + d}</span></div>
      </div>
      <div style={{ background: "#fff", borderRadius: 10, padding: 14, border: "1px solid #eee", marginBottom: 14 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, background: s.ok ? "#F0FDF4" : "#f8f8f8", border: `2px solid ${s.ok ? "#22c55e" : "#e0e0e0"}` }}>{s.i}</div>
              {i < steps.length - 1 && <div style={{ width: 2, height: 20, background: s.ok ? "#22c55e" : "#e0e0e0" }} />}
            </div>
            <div style={{ paddingBottom: 8 }}><p style={{ fontSize: 12, fontWeight: 600, color: s.ok ? "#333" : "#bbb", margin: 0 }}>{s.l}</p>{s.t && <p style={{ fontSize: 10, color: s.ok ? "#16a34a" : "#ccc", margin: 0 }}>{s.t}</p>}</div>
          </div>
        ))}
      </div>
      <button onClick={() => setPage("home")} style={{ width: "100%", padding: 11, borderRadius: 10, border: "2px solid #FF6B35", background: "#fff", color: "#FF6B35", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ New Order</button>
    </div>
  );
}

/* ══════ ORDERS ══════ */
function OrdersPage({ setPage }) {
  const o = [{ id: "#PK-20260314-001", d: "14 Mar", s: "Printing", it: "Color — thesis.pdf (60p×2)", t: "₹1,010", p: 40, c: "#f59e0b" }, { id: "#PK-20260312-003", d: "12 Mar", s: "Delivered", it: "B&W — notes.pdf (120p×1)", t: "₹280", p: 100, c: "#22c55e" }];
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 16px" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 16px", fontFamily: "'DM Serif Display',Georgia,serif" }}>My Orders</h2>
      {o.map(x => (
        <div key={x.id} style={{ background: "#fff", borderRadius: 10, padding: 14, border: "1px solid #eee", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#FF6B35", fontFamily: "monospace" }}>{x.id} <span style={{ color: "#bbb", fontFamily: "sans-serif", fontWeight: 400, marginLeft: 4 }}>{x.d}</span></span>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 12, background: `${x.c}15`, color: x.c }}>{x.s}</span>
          </div>
          <p style={{ fontSize: 12, color: "#888", margin: "0 0 6px" }}>{x.it}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: "#f0f0f0" }}><div style={{ height: "100%", borderRadius: 2, width: `${x.p}%`, background: x.c }} /></div>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{x.t}</span>
          </div>
        </div>
      ))}
      <button onClick={() => setPage("home")} style={{ width: "100%", padding: 11, borderRadius: 10, border: "2px solid #FF6B35", background: "#fff", color: "#FF6B35", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 6 }}>+ New Order</button>
    </div>
  );
}

/* ══════ ACCOUNT ══════ */
function AccountPage({ user, setPage, onSignOut }) {
  if (!user) return <div style={{ maxWidth: 400, margin: "0 auto", padding: "50px 16px", textAlign: "center" }}><div style={{ fontSize: 36 }}>👤</div><h2 style={{ fontSize: 18, fontWeight: 700, margin: "8px 0" }}>Sign in to view account</h2><button onClick={() => setPage("signin")} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Sign In</button></div>;
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 16px", fontFamily: "'DM Serif Display',Georgia,serif" }}>My Account</h2>
      <div style={{ background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #eee", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{user.name[0].toUpperCase()}</div>
          <div><div style={{ fontSize: 16, fontWeight: 700 }}>{user.name}</div><div style={{ fontSize: 12, color: "#888" }}>+91 {user.phone}</div></div>
        </div>
        <button onClick={() => setPage("orders")} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1.5px solid #e0e0e0", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>📦 My Orders</button>
      </div>
      <button onClick={onSignOut} style={{ width: "100%", padding: 11, borderRadius: 10, border: "1.5px solid #ef4444", background: "#fff", color: "#ef4444", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Sign Out</button>
    </div>
  );
}

/* ══════ ABOUT ══════ */
function AboutPage() {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 16px" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 16px", fontFamily: "'DM Serif Display',Georgia,serif" }}>About PrintKaaro</h2>
      <div style={{ background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #eee", marginBottom: 12 }}>
        <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: 0 }}>PrintKaaro makes document printing easy. Upload your PDF, choose options, pay online, and we deliver to your doorstep. Based in West Bengal, we offer B&W, color printing, booklets, and binding services.</p>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #eee" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#FF6B35", margin: "0 0 10px" }}>Why Choose Us?</h3>
        {[{ i: "⚡", t: "24hr Turnaround" }, { i: "💰", t: "B&W ₹2/pg, Color ₹8/pg" }, { i: "🔒", t: "Secure file handling" }, { i: "🚚", t: "Free delivery above ₹500" }].map((x, j) => (
          <div key={j} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FFF3ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{x.i}</div>
            <span style={{ fontSize: 13, color: "#555", alignSelf: "center" }}>{x.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════ CONTACT ══════ */
function ContactPage() {
  const [sent, setSent] = useState(false);
  const i = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e0e0e0", outline: "none", boxSizing: "border-box" };
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 16px", fontFamily: "'DM Serif Display',Georgia,serif" }}>Contact Us</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[{ i: "💬", l: "WhatsApp", c: "#25D366", h: "https://wa.me/91XXXXXXXXXX" }, { i: "📞", l: "Call Us", c: "#3b82f6", h: "tel:+91XXXXXXXXXX" }, { i: "✉️", l: "Email", c: "#FF6B35", h: "mailto:hello@printkaaro.in" }, { i: "📍", l: "Balurghat, WB", c: "#333" }].map((x, j) =>
          x.h ? <a key={j} href={x.h} target="_blank" rel="noopener noreferrer" style={{ padding: 14, background: "#fff", borderRadius: 10, border: "1px solid #eee", textAlign: "center", textDecoration: "none" }}><div style={{ fontSize: 20, marginBottom: 2 }}>{x.i}</div><div style={{ fontSize: 12, fontWeight: 600, color: x.c }}>{x.l}</div></a>
            : <div key={j} style={{ padding: 14, background: "#fff", borderRadius: 10, border: "1px solid #eee", textAlign: "center" }}><div style={{ fontSize: 20, marginBottom: 2 }}>{x.i}</div><div style={{ fontSize: 12, fontWeight: 600, color: x.c }}>{x.l}</div></div>
        )}
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #eee" }}>
        {sent ? <div style={{ textAlign: "center", padding: "12px 0" }}><div style={{ fontSize: 28 }}>✅</div><p style={{ fontSize: 14, fontWeight: 600, color: "#16a34a", margin: "4px 0 0" }}>Sent! We'll reply soon.</p></div>
          : <><input placeholder="Name" style={{ ...i, marginBottom: 6 }} /><input placeholder="Phone or email" style={{ ...i, marginBottom: 6 }} /><textarea rows={3} placeholder="Message" style={{ ...i, resize: "none", marginBottom: 8 }} /><button onClick={() => setSent(true)} style={{ width: "100%", padding: 11, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Send</button></>}
      </div>
    </div>
  );
}

/* ══════ APP ══════ */
export default function PrintKaaro() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [address, setAddress] = useState(null);
  const [pending, setPending] = useState(null);
  const proceed = d => { if (!user) { setPending(d); setPage("signin"); } else { setOrder(d); setPage("address"); } };
  const auth = u => { setUser(u); if (pending) { setOrder(pending); setPending(null); setPage("address"); } else setPage("home"); };
  const out = () => { setUser(null); setPage("home"); };
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", fontFamily: "'DM Sans',sans-serif", width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
      <Navbar user={user} setPage={setPage} page={page} onSignOut={out} />
      {page === "home" && <HomePage onProceed={proceed} />}
      {page === "signin" && <AuthPage onAuth={auth} />}
      {page === "address" && order && <AddressPage onConfirm={a => { setAddress(a); setPage("payment"); }} onBack={() => setPage("home")} />}
      {page === "payment" && order && <PaymentPage order={order} onPay={() => setPage("status")} onBack={() => setPage("address")} />}
      {page === "status" && order && address && <StatusPage order={order} address={address} setPage={setPage} />}
      {page === "orders" && <OrdersPage setPage={setPage} />}
      {page === "account" && <AccountPage user={user} setPage={setPage} onSignOut={out} />}
      {page === "about" && <AboutPage />}
      {page === "contact" && <ContactPage />}
      <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" style={{ position: "fixed", bottom: 16, right: 16, width: 48, height: 48, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#fff", boxShadow: "0 3px 12px rgba(37,211,102,.4)", zIndex: 40, textDecoration: "none" }}>💬</a>
      <footer style={{ borderTop: "1px solid #eee", padding: 16, textAlign: "center", marginTop: 24 }}><p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>© 2026 PrintKaaro</p></footer>
    </div>
  );
}
