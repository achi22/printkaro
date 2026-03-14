import { useState, useRef } from "react";

const BINDING = [
  { id: "none", name: "No Binding", price: 0, icon: "📋" },
  { id: "spiral", name: "Spiral", price: 25, icon: "🔗" },
  { id: "staple", name: "Staple", price: 10, icon: "📌" },
  { id: "perfect", name: "Perfect Bind", price: 60, icon: "📖" },
  { id: "hardcover", name: "Hardcover", price: 150, icon: "📕" },
];

/* ════════ GLOBAL STYLES ════════ */
const G = `
input[type="number"]{font-size:16px!important}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
input[type="number"]{-moz-appearance:textfield;appearance:textfield}
@media(max-width:768px){
  .pk-desktop{display:none!important}
  .pk-burger{display:flex!important}
  .pk-main{flex-direction:column!important}
  .pk-summary{flex:1 1 100%!important;position:static!important;order:2}
  .pk-left{flex:1 1 100%!important}
  .pk-hero h1{font-size:28px!important}
  .pk-hero p{font-size:13px!important}
}
`;

/* ════════ PILL BUTTON ════════ */
function Pill({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
      border: `1.5px solid ${active ? "#FF6B35" : "#e0e0e0"}`,
      background: active ? "#FFF3ED" : "#fff", color: active ? "#FF6B35" : "#555"
    }}>{label}</button>
  );
}

/* ════════ STEPPER INPUT ════════ */
function Stepper({ value, onChange, label, sub }) {
  const v = parseInt(value) || 1;
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 4 }}>{label} {sub && <span style={{ color: "#16a34a", fontWeight: 500 }}>{sub}</span>}</label>
      <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e0e0e0", borderRadius: 8, overflow: "hidden", height: 34 }}>
        <button onClick={() => onChange(Math.max(1, v - 1))}
          style={{ width: 28, height: 34, border: "none", background: v <= 1 ? "#f5f5f5" : "#FFF3ED", color: v <= 1 ? "#ccc" : "#FF6B35", fontSize: 14, fontWeight: 700, cursor: v <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0 }}>−</button>
        <input type="number" inputMode="numeric" min="1" value={value}
          onChange={e => { const x = e.target.value; onChange(x === "" ? "" : Math.max(1, parseInt(x) || 1)); }}
          onBlur={() => { if (!value || value < 1) onChange(1); }}
          style={{ flex: 1, padding: "4px 0", border: "none", borderLeft: "1px solid #e0e0e0", borderRight: "1px solid #e0e0e0", fontSize: 15, fontWeight: 600, outline: "none", textAlign: "center", boxSizing: "border-box", minWidth: 0, background: "transparent" }} />
        <button onClick={() => onChange(v + 1)}
          style={{ width: 28, height: 34, border: "none", background: "#FFF3ED", color: "#FF6B35", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0 }}>+</button>
      </div>
    </div>
  );
}

/* ════════ PROGRESS BAR ════════ */
function ProgressBar({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
      {["Upload", "Address", "Payment", "Done"].map((s, i) => (
        <div key={s} style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: i <= step ? "linear-gradient(135deg,#FF6B35,#FF8C42)" : "#eee", color: i <= step ? "#fff" : "#bbb" }}>{i + 1}</div>
            <span style={{ fontSize: 10, marginTop: 3, color: i <= step ? "#FF6B35" : "#bbb", fontWeight: 500 }}>{s}</span>
          </div>
          {i < 3 && <div style={{ flex: 1, height: 2, background: i < step ? "#FF6B35" : "#eee", margin: "0 -6px", marginBottom: 16 }} />}
        </div>
      ))}
    </div>
  );
}

/* ════════ NAVBAR + HAMBURGER ════════ */
function Navbar({ user, setPage, page, onSignOut }) {
  const [open, setOpen] = useState(false);
  const go = p => { setPage(p); setOpen(false); };
  const items = [
    { k: "home", l: "Home", i: "🏠" }, { k: "orders", l: "My Orders", i: "📦" },
    { k: "account", l: "My Account", i: "👤" }, { k: "about", l: "About Us", i: "ℹ️" },
    { k: "contact", l: "Contact Us", i: "📞" },
  ];
  return (
    <>
      <nav style={{ background: "#fff", borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" }}>
          <button onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 8, border: "none", background: "none", cursor: "pointer" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#FF6B35,#FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>P</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", fontFamily: "'DM Serif Display',Georgia,serif" }}>PrintKaaro</span>
          </button>
          {/* Desktop */}
          <div className="pk-desktop" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {items.slice(0, 3).map(p => (
              <button key={p.k} onClick={() => go(p.k)} style={{ padding: "7px 14px", borderRadius: 7, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", background: page === p.k ? "#FFF3ED" : "transparent", color: page === p.k ? "#FF6B35" : "#666" }}>{p.l}</button>
            ))}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 6 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 600 }}>{user.name[0].toUpperCase()}</div>
                <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>{user.name}</span>
              </div>
            ) : (
              <button onClick={() => go("signin")} style={{ marginLeft: 6, padding: "7px 16px", borderRadius: 7, fontSize: 13, fontWeight: 600, border: "2px solid #FF6B35", background: "#fff", color: "#FF6B35", cursor: "pointer" }}>Sign In</button>
            )}
          </div>
          {/* Hamburger */}
          <button className="pk-burger" onClick={() => setOpen(!open)} style={{ display: "none", border: "none", background: "none", cursor: "pointer", padding: 4, flexDirection: "column", gap: 5 }}>
            <span style={{ display: "block", width: 22, height: 2, borderRadius: 2, background: open ? "#FF6B35" : "#333", transition: "all .2s", transform: open ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, borderRadius: 2, background: "#333", transition: "all .2s", opacity: open ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, borderRadius: 2, background: open ? "#FF6B35" : "#333", transition: "all .2s", transform: open ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>
      </nav>
      {/* Overlay */}
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 60 }} />}
      {/* Drawer */}
      <div style={{ position: "fixed", top: 0, right: 0, width: 260, height: "100vh", background: "#fff", zIndex: 70, transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .25s ease", boxShadow: open ? "-4px 0 30px rgba(0,0,0,.1)" : "none", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid #f0f0f0" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 17, fontWeight: 700 }}>{user.name[0].toUpperCase()}</div>
              <div><div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{user.name}</div><div style={{ fontSize: 11, color: "#999" }}>{user.phone}</div></div>
            </div>
          ) : (
            <button onClick={() => go("signin")} style={{ width: "100%", padding: 10, borderRadius: 8, border: "none", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Sign In / Sign Up</button>
          )}
        </div>
        <div style={{ flex: 1, padding: "6px 0" }}>
          {items.map(it => (
            <button key={it.k} onClick={() => go(it.k)} style={{ width: "100%", padding: "12px 16px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 500, textAlign: "left", background: page === it.k ? "#FFF3ED" : "#fff", color: page === it.k ? "#FF6B35" : "#444", borderLeft: page === it.k ? "3px solid #FF6B35" : "3px solid transparent" }}>
              <span style={{ fontSize: 16 }}>{it.i}</span>{it.l}
            </button>
          ))}
        </div>
        {user && <div style={{ padding: "14px 16px", borderTop: "1px solid #f0f0f0" }}><button onClick={() => { onSignOut(); setOpen(false); }} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1.5px solid #ef4444", background: "#fff", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Sign Out</button></div>}
      </div>
    </>
  );
}

/* ════════ AUTH PAGE ════════ */
function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    setErr("");
    if (mode === "signup" && !name.trim()) return setErr("Enter your name");
    if (phone.length < 10) return setErr("Enter valid phone number");
    if (password.length < 4) return setErr("Password min 4 characters");
    onAuth({ name: name || phone, email, phone, id: Date.now() });
  };
  const inp = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 16, outline: "none", boxSizing: "border-box" };
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "linear-gradient(135deg,#FFF9F5,#FFF0E8)" }}>
      <div style={{ width: "100%", maxWidth: 400, background: "#fff", borderRadius: 18, padding: "32px 28px", boxShadow: "0 16px 50px rgba(255,107,53,.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#FF6B35,#FF8C42)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 12 }}>P</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: 0, fontFamily: "'DM Serif Display',Georgia,serif" }}>{mode === "signin" ? "Welcome Back" : "Create Account"}</h2>
          <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{mode === "signin" ? "Sign in to track your orders" : "Join PrintKaaro"}</p>
        </div>
        {mode === "signup" && <><label style={{ fontSize: 11, fontWeight: 600, color: "#666", display: "block", marginBottom: 4 }}>FULL NAME</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ ...inp, marginBottom: 12 }} /></>}
        <label style={{ fontSize: 11, fontWeight: 600, color: "#666", display: "block", marginBottom: 4 }}>PHONE NUMBER</label>
        <div style={{ display: "flex", border: "1.5px solid #e0e0e0", borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
          <span style={{ padding: "11px 10px", background: "#f8f8f8", fontSize: 13, color: "#666", borderRight: "1px solid #e0e0e0" }}>+91</span>
          <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" style={{ flex: 1, padding: "11px 12px", border: "none", fontSize: 16, outline: "none" }} />
        </div>
        {mode === "signup" && <><label style={{ fontSize: 11, fontWeight: 600, color: "#666", display: "block", marginBottom: 4 }}>EMAIL (OPTIONAL)</label><input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ ...inp, marginBottom: 12 }} /></>}
        <label style={{ fontSize: 11, fontWeight: 600, color: "#666", display: "block", marginBottom: 4 }}>PASSWORD</label>
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" type="password" style={{ ...inp, marginBottom: 16 }} />
        {err && <p style={{ color: "#e53e3e", fontSize: 12, marginBottom: 10, textAlign: "center" }}>{err}</p>}
        <button onClick={submit} style={{ width: "100%", padding: 13, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{mode === "signin" ? "Sign In" : "Create Account"}</button>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#888" }}>
          {mode === "signin" ? "No account? " : "Have an account? "}
          <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(""); }} style={{ color: "#FF6B35", fontWeight: 600, border: "none", background: "none", cursor: "pointer", fontSize: 13 }}>{mode === "signin" ? "Sign Up" : "Sign In"}</button>
        </p>
      </div>
    </div>
  );
}

/* ════════ HOME PAGE ════════ */
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
      const reader = new FileReader();
      reader.onload = e => {
        const str = new TextDecoder("latin1").decode(new Uint8Array(e.target.result));
        const m = str.match(/\/Type\s*\/Page[^s]/g);
        setPages(Math.max(1, m ? m.length : Math.ceil(f.size / 30000) || 1));
      };
      reader.readAsArrayBuffer(f);
    }
  };

  const proceed = () => { if (!file) return; onProceed({ file: file.name, pages, copies, colorMode: color, paperSize: paper, sided, binding: bo.name, price: sub }); };

  return (
    <div style={{ background: "linear-gradient(180deg,#FFF9F5 0%,#FFF 40%)", minHeight: "80vh" }}>
      {/* Hero */}
      <div className="pk-hero" style={{ textAlign: "center", padding: "36px 20px 16px" }}>
        <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 16, fontSize: 11, fontWeight: 600, background: "#FFF3ED", color: "#FF6B35", marginBottom: 12, letterSpacing: .5 }}>UPLOAD &rarr; CONFIGURE &rarr; PAY &rarr; DELIVERED</div>
        <h1 style={{ fontSize: 38, fontWeight: 700, color: "#1a1a2e", margin: "0 0 8px", lineHeight: 1.15, fontFamily: "'DM Serif Display',Georgia,serif" }}>
          Get Your Documents<br /><span style={{ background: "linear-gradient(135deg,#FF6B35,#FF8C42)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Printed & Delivered</span>
        </h1>
        <p style={{ fontSize: 14, color: "#888", maxWidth: 440, margin: "0 auto" }}>Upload PDF, choose options, pay online. We deliver to your doorstep.</p>
      </div>

      <div className="pk-main" style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px", display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Left */}
        <div className="pk-left" style={{ flex: "1 1 520px", minWidth: 0 }}>
          {/* Upload */}
          <div onClick={() => ref.current?.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
            style={{ border: `2px dashed ${drag ? "#FF6B35" : file ? "#22c55e" : "#d0d0d0"}`, borderRadius: 12, padding: file ? "16px" : "24px 16px", textAlign: "center", cursor: "pointer", background: drag ? "#FFF8F4" : file ? "#F0FDF4" : "#FAFAFA", marginBottom: 16 }}>
            <input ref={ref} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            {file ? (
              <><span style={{ fontSize: 24 }}>✅</span><p style={{ fontSize: 14, fontWeight: 600, color: "#16a34a", margin: "4px 0 0" }}>{file.name}</p><p style={{ fontSize: 11, color: "#888", margin: "2px 0 0" }}>{(file.size / 1024).toFixed(0)} KB &bull; {pages} pages detected &bull; tap to change</p></>
            ) : (
              <><div style={{ fontSize: 32, marginBottom: 4 }}>📄</div><p style={{ fontSize: 15, fontWeight: 600, color: "#333", margin: 0 }}>Drop your PDF here</p><p style={{ fontSize: 12, color: "#999", margin: "4px 0 0" }}>or tap to browse &bull; Max 50MB</p></>
            )}
          </div>

          {/* Options */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "18px 16px", border: "1px solid #eee" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 14px" }}>Print Options</h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 6 }}>PRINT TYPE</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Pill label="B&W ₹2/pg" active={color === "bw"} onClick={() => setColor("bw")} />
                <Pill label="Color ₹8/pg" active={color === "color"} onClick={() => setColor("color")} />
                <Pill label="Booklet ₹5/pg" active={color === "booklet"} onClick={() => setColor("booklet")} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 6 }}>PAPER SIZE</label>
              <div style={{ display: "flex", gap: 6 }}>
                {["A4", "A3", "Legal", "A5"].map(s => <Pill key={s} label={s} active={paper === s} onClick={() => setPaper(s)} />)}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 6 }}>PRINT SIDE</label>
              <div style={{ display: "flex", gap: 6 }}>
                <Pill label="Single Side" active={sided === "single"} onClick={() => setSided("single")} />
                <Pill label="Both Sides (−30%)" active={sided === "double"} onClick={() => setSided("double")} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <Stepper value={pages} onChange={setPages} label="PAGES" sub={file ? "(auto)" : ""} />
              <Stepper value={copies} onChange={setCopies} label="COPIES" />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 6 }}>BINDING</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {BINDING.map(b => <Pill key={b.id} label={`${b.icon} ${b.name}${b.price ? ` +₹${b.price}` : ""}`} active={bind === b.id} onClick={() => setBind(b.id)} />)}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="pk-summary" style={{ flex: "0 0 320px", position: "sticky", top: 72 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "18px 16px", border: "1px solid #eee", boxShadow: "0 6px 24px rgba(0,0,0,.03)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", margin: "0 0 12px" }}>Order Summary</h3>
            {file ? (<>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#F0FDF4", borderRadius: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 16 }}>📄</span>
                <div><p style={{ fontSize: 12, fontWeight: 600, color: "#333", margin: 0 }}>{file.name}</p><p style={{ fontSize: 10, color: "#888", margin: 0 }}>{pages}p &bull; {copies}c &bull; {paper} &bull; {color === "bw" ? "B&W" : "Color"}</p></div>
              </div>
              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 10, fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#666" }}><span>Printing ({pages}p × {copies}c)</span><span style={{ fontWeight: 600, color: "#333" }}>₹{Math.ceil(ppp * sm * pages * copies)}</span></div>
                {bo.price > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#666" }}><span>{bo.name} × {copies}</span><span style={{ fontWeight: 600, color: "#333" }}>₹{bo.price * copies}</span></div>}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#666" }}><span>Delivery</span><span style={{ fontWeight: 600, color: del === 0 ? "#16a34a" : "#333" }}>{del === 0 ? "FREE" : `₹${del}`}</span></div>
              </div>
              <div style={{ borderTop: "2px solid #FF6B35", paddingTop: 10, marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>Total</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#FF6B35" }}>₹{sub + del}</span>
              </div>
            </>) : (
              <div style={{ textAlign: "center", padding: "14px 0", color: "#ccc" }}><div style={{ fontSize: 28, marginBottom: 4 }}>📄</div><p style={{ fontSize: 12, margin: 0 }}>Upload a PDF to see pricing</p></div>
            )}
            <button onClick={proceed} disabled={!file}
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", marginTop: 12, background: file ? "linear-gradient(135deg,#FF6B35,#FF8C42)" : "#e0e0e0", color: file ? "#fff" : "#999", fontSize: 15, fontWeight: 700, cursor: file ? "pointer" : "not-allowed", boxShadow: file ? "0 4px 16px rgba(255,107,53,.25)" : "none" }}>
              {file ? "Proceed to Checkout →" : "Upload a PDF first"}
            </button>
            {sub > 0 && sub < 500 && <p style={{ fontSize: 10, color: "#999", textAlign: "center", marginTop: 6 }}>Add ₹{500 - sub} more for free delivery</p>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 10 }}>
            {[{ i: "⚡", t: "24hr Turnaround" }, { i: "🔒", t: "Secure Files" }, { i: "📱", t: "UPI & Razorpay" }, { i: "🚚", t: "Home Delivery" }].map(x => (
              <div key={x.t} style={{ background: "#fff", borderRadius: 8, padding: "8px 10px", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{x.i}</span><span style={{ fontSize: 10, color: "#888", fontWeight: 500 }}>{x.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════ ADDRESS PAGE ════════ */
function AddressPage({ onConfirm, onBack }) {
  const [n, sN] = useState(""); const [ph, sPh] = useState(""); const [ad, sAd] = useState("");
  const [ci, sCi] = useState(""); const [pin, sPin] = useState(""); const [no, sNo] = useState("");
  const ok = n && ph.length >= 10 && ad && ci && pin.length >= 6;
  const inp = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 16, outline: "none", boxSizing: "border-box" };
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px" }}>
      <button onClick={onBack} style={{ border: "none", background: "none", color: "#888", fontSize: 13, cursor: "pointer", marginBottom: 16 }}>← Back</button>
      <ProgressBar step={1} />
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px", fontFamily: "'DM Serif Display',Georgia,serif" }}>Delivery Address</h2>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Where should we deliver?</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 4 }}>FULL NAME</label><input value={n} onChange={e => sN(e.target.value)} placeholder="Your name" style={inp} /></div>
        <div><label style={{ fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 4 }}>PHONE</label><input value={ph} onChange={e => sPh(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" style={inp} /></div>
        <div><label style={{ fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 4 }}>PINCODE</label><input value={pin} onChange={e => sPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="733101" style={inp} /></div>
        <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 4 }}>ADDRESS</label><textarea value={ad} onChange={e => sAd(e.target.value)} rows={2} placeholder="House, Street, Locality" style={{ ...inp, resize: "none" }} /></div>
        <div><label style={{ fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 4 }}>CITY</label><input value={ci} onChange={e => sCi(e.target.value)} placeholder="Balurghat" style={inp} /></div>
        <div><label style={{ fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 4 }}>STATE</label><input value="West Bengal" disabled style={{ ...inp, background: "#f8f8f8", color: "#666" }} /></div>
        <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 4 }}>NOTES (OPTIONAL)</label><input value={no} onChange={e => sNo(e.target.value)} placeholder="e.g. Print only pages 1-10" style={inp} /></div>
      </div>
      <button onClick={() => ok && onConfirm({ name: n, phone: ph, address: ad, city: ci, pincode: pin, notes: no })} disabled={!ok}
        style={{ width: "100%", padding: 13, borderRadius: 10, border: "none", marginTop: 18, background: ok ? "linear-gradient(135deg,#FF6B35,#FF8C42)" : "#e0e0e0", color: ok ? "#fff" : "#999", fontSize: 15, fontWeight: 700, cursor: ok ? "pointer" : "not-allowed" }}>Proceed to Payment →</button>
    </div>
  );
}

/* ════════ PAYMENT PAGE ════════ */
function PaymentPage({ order, onPay, onBack }) {
  const [m, setM] = useState("upi");
  const d = order.price >= 500 ? 0 : 40;
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px" }}>
      <button onClick={onBack} style={{ border: "none", background: "none", color: "#888", fontSize: 13, cursor: "pointer", marginBottom: 16 }}>← Back</button>
      <ProgressBar step={2} />
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px", fontFamily: "'DM Serif Display',Georgia,serif" }}>Payment</h2>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Choose payment method</p>
      <div style={{ background: "#FFFAF7", borderRadius: 12, padding: 16, border: "1px solid #FFE8D9", marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666", marginBottom: 6 }}><span>📄 {order.file}</span><span style={{ fontWeight: 600, color: "#333" }}>{order.pages}p × {order.copies}c</span></div>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{order.colorMode === "bw" ? "B&W" : "Color"} &bull; {order.paperSize} &bull; {order.sided}-sided &bull; {order.binding}</div>
        <div style={{ borderTop: "1px dashed #FFD5BE", paddingTop: 8, marginTop: 8, display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 15, fontWeight: 700 }}>Total</span><span style={{ fontSize: 22, fontWeight: 800, color: "#FF6B35" }}>₹{order.price + d}</span></div>
      </div>
      {[{ id: "upi", icon: "📱", l: "UPI (GPay / PhonePe / Paytm)", d: "Instant UPI payment" }, { id: "razorpay", icon: "💳", l: "Card / Netbanking / Wallet", d: "Via Razorpay" }].map(x => (
        <button key={x.id} onClick={() => setM(x.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 10, cursor: "pointer", border: `2px solid ${m === x.id ? "#FF6B35" : "#eee"}`, background: m === x.id ? "#FFF8F4" : "#fff", textAlign: "left", marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>{x.icon}</span>
          <div style={{ flex: 1 }}><p style={{ fontSize: 14, fontWeight: 600, color: "#333", margin: 0 }}>{x.l}</p><p style={{ fontSize: 11, color: "#999", margin: 0 }}>{x.d}</p></div>
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${m === x.id ? "#FF6B35" : "#ddd"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{m === x.id && <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#FF6B35" }} />}</div>
        </button>
      ))}
      <button onClick={() => onPay(m)} style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", marginTop: 10, background: m === "upi" ? "linear-gradient(135deg,#059669,#10b981)" : "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>{m === "upi" ? "📱" : "💳"} Pay ₹{order.price + d}</button>
      <p style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 8 }}>🔒 Secured by Razorpay</p>
    </div>
  );
}

/* ════════ ORDER STATUS ════════ */
function StatusPage({ order, address, setPage }) {
  const id = `#PK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`;
  const d = order.price >= 500 ? 0 : 40;
  const steps = [{ l: "Order Placed", t: "Just now", done: true, i: "✅" }, { l: "Payment Confirmed", t: "Just now", done: true, i: "💳" }, { l: "Printing", t: "Est. 2-4 hrs", done: false, i: "🖨️" }, { l: "Ready", t: "", done: false, i: "📦" }, { l: "Out for Delivery", t: "", done: false, i: "🚚" }, { l: "Delivered", t: "", done: false, i: "🏠" }];
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px" }}>
      <ProgressBar step={3} />
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", marginBottom: 12 }}>✓</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px", fontFamily: "'DM Serif Display',Georgia,serif" }}>Order Confirmed!</h2>
        <p style={{ fontSize: 13, color: "#888" }}>{id}</p>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #eee", marginBottom: 16, fontSize: 13 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ color: "#888" }}>File</span><span style={{ fontWeight: 600 }}>{order.file}</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ color: "#888" }}>Options</span><span>{order.pages}p × {order.copies}c &bull; {order.paperSize}</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ color: "#888" }}>Deliver to</span><span style={{ textAlign: "right", maxWidth: 220 }}>{address.address}, {address.city}</span></div>
        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 8, marginTop: 8, display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700 }}>Total Paid</span><span style={{ fontSize: 18, fontWeight: 800, color: "#FF6B35" }}>₹{order.price + d}</span></div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #eee", marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 14px" }}>Order Status</h3>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, background: s.done ? "#F0FDF4" : "#f8f8f8", border: `2px solid ${s.done ? "#22c55e" : "#e0e0e0"}` }}>{s.i}</div>
              {i < steps.length - 1 && <div style={{ width: 2, height: 24, background: s.done ? "#22c55e" : "#e0e0e0" }} />}
            </div>
            <div style={{ paddingBottom: 10 }}><p style={{ fontSize: 13, fontWeight: 600, color: s.done ? "#333" : "#bbb", margin: 0 }}>{s.l}</p>{s.t && <p style={{ fontSize: 11, color: s.done ? "#16a34a" : "#ccc", margin: "1px 0 0" }}>{s.t}</p>}</div>
          </div>
        ))}
      </div>
      <button onClick={() => setPage("home")} style={{ width: "100%", padding: 12, borderRadius: 10, border: "2px solid #FF6B35", background: "#fff", color: "#FF6B35", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Place Another Order</button>
    </div>
  );
}

/* ════════ MY ORDERS ════════ */
function OrdersPage({ setPage }) {
  const orders = [
    { id: "#PK-20260314-001", date: "14 Mar", status: "Printing", items: "Color — thesis.pdf (60p×2)", total: "₹1,010", pct: 40, sc: "#f59e0b" },
    { id: "#PK-20260312-003", date: "12 Mar", status: "Delivered", items: "B&W — notes.pdf (120p×1)", total: "₹280", pct: 100, sc: "#22c55e" },
  ];
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", margin: "0 0 18px", fontFamily: "'DM Serif Display',Georgia,serif" }}>My Orders</h2>
      {orders.map(o => (
        <div key={o.id} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #eee", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div><span style={{ fontSize: 13, fontWeight: 700, color: "#FF6B35", fontFamily: "monospace" }}>{o.id}</span><span style={{ fontSize: 11, color: "#bbb", marginLeft: 8 }}>{o.date}</span></div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 16, background: `${o.sc}15`, color: o.sc }}>{o.status}</span>
          </div>
          <p style={{ fontSize: 12, color: "#888", margin: "0 0 8px" }}>{o.items}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: "#f0f0f0" }}><div style={{ height: "100%", borderRadius: 2, width: `${o.pct}%`, background: o.sc }} /></div>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{o.total}</span>
          </div>
        </div>
      ))}
      <button onClick={() => setPage("home")} style={{ width: "100%", padding: 12, borderRadius: 10, border: "2px solid #FF6B35", background: "#fff", color: "#FF6B35", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>+ New Order</button>
    </div>
  );
}

/* ════════ ACCOUNT ════════ */
function AccountPage({ user, setPage, onSignOut }) {
  if (!user) return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px" }}>Sign in to view account</h2>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Manage addresses, payments, and orders.</p>
      <button onClick={() => setPage("signin")} style={{ padding: "10px 28px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Sign In</button>
    </div>
  );
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", margin: "0 0 18px", fontFamily: "'DM Serif Display',Georgia,serif" }}>My Account</h2>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 700 }}>{user.name[0].toUpperCase()}</div>
          <div><div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e" }}>{user.name}</div><div style={{ fontSize: 12, color: "#888" }}>📱 +91 {user.phone}</div>{user.email && <div style={{ fontSize: 12, color: "#888" }}>✉️ {user.email}</div>}</div>
        </div>
        <button onClick={() => setPage("orders")} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1.5px solid #e0e0e0", background: "#fff", color: "#333", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>📦 View My Orders</button>
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px" }}>Payment Methods</h3>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ i: "📱", n: "UPI", d: "GPay, PhonePe" }, { i: "💳", n: "Razorpay", d: "Cards, Netbanking" }].map(p => (
            <div key={p.n} style={{ flex: 1, padding: 12, background: "#f9f9f9", borderRadius: 10, textAlign: "center" }}><div style={{ fontSize: 20, marginBottom: 2 }}>{p.i}</div><div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{p.n}</div><div style={{ fontSize: 10, color: "#999" }}>{p.d}</div></div>
          ))}
        </div>
      </div>
      <button onClick={onSignOut} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #ef4444", background: "#fff", color: "#ef4444", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Sign Out</button>
    </div>
  );
}

/* ════════ ABOUT ════════ */
function AboutPage() {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px", fontFamily: "'DM Serif Display',Georgia,serif" }}>About PrintKaaro</h2>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 18 }}>Your trusted online print partner</p>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#FF6B35", margin: "0 0 10px" }}>Our Story</h3>
        <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: 0 }}>PrintKaaro was born from a simple idea: getting documents printed shouldn't be a hassle. Based in West Bengal, we offer B&W and color printing, booklets, and binding — all delivered to your doorstep.</p>
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#FF6B35", margin: "0 0 12px" }}>Why Choose Us?</h3>
        {[{ i: "⚡", t: "Fast Turnaround", d: "Most orders printed within 24 hours" }, { i: "💰", t: "Affordable", d: "B&W from ₹2/page, Color from ₹8/page" }, { i: "🔒", t: "Secure Files", d: "Encrypted and auto-deleted after printing" }, { i: "🚚", t: "Home Delivery", d: "Free on orders above ₹500" }, { i: "📱", t: "Easy Payments", d: "UPI, Google Pay, PhonePe, cards" }, { i: "🎯", t: "Quality", d: "Professional printing on premium paper" }].map((x, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#FFF3ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{x.i}</div>
            <div><div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{x.t}</div><div style={{ fontSize: 12, color: "#888" }}>{x.d}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════ CONTACT ════════ */
function ContactPage() {
  const [sent, setSent] = useState(false);
  const inp = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontSize: 16, outline: "none", boxSizing: "border-box" };
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px", fontFamily: "'DM Serif Display',Georgia,serif" }}>Contact Us</h2>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 18 }}>We'd love to hear from you</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[{ i: "💬", l: "WhatsApp", c: "#25D366", href: "https://wa.me/91XXXXXXXXXX" }, { i: "📞", l: "Call Us", c: "#3b82f6", href: "tel:+91XXXXXXXXXX" }, { i: "✉️", l: "Email", c: "#FF6B35", href: "mailto:hello@printkaaro.in" }, { i: "📍", l: "Balurghat, WB", c: "#333" }].map((x, i) => (
          x.href ? (
            <a key={i} href={x.href} target="_blank" rel="noopener noreferrer" style={{ padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #eee", textAlign: "center", textDecoration: "none" }}><div style={{ fontSize: 24, marginBottom: 4 }}>{x.i}</div><div style={{ fontSize: 13, fontWeight: 600, color: x.c }}>{x.l}</div></a>
          ) : (
            <div key={i} style={{ padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #eee", textAlign: "center" }}><div style={{ fontSize: 24, marginBottom: 4 }}>{x.i}</div><div style={{ fontSize: 13, fontWeight: 600, color: x.c }}>{x.l}</div></div>
          )
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Send a message</h3>
        {sent ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}><div style={{ fontSize: 32, marginBottom: 6 }}>✅</div><p style={{ fontSize: 14, fontWeight: 600, color: "#16a34a", margin: 0 }}>Sent! We'll reply within 24hrs.</p></div>
        ) : (<>
          <input placeholder="Your name" style={{ ...inp, marginBottom: 8 }} />
          <input placeholder="Phone or email" style={{ ...inp, marginBottom: 8 }} />
          <textarea rows={3} placeholder="How can we help?" style={{ ...inp, resize: "none", marginBottom: 10 }} />
          <button onClick={() => setSent(true)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Send Message</button>
        </>)}
      </div>
    </div>
  );
}

/* ════════ MAIN APP ════════ */
export default function PrintKaaro() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [address, setAddress] = useState(null);
  const [pending, setPending] = useState(null);

  const proceed = d => { if (!user) { setPending(d); setPage("signin"); } else { setOrder(d); setPage("address"); } };
  const auth = u => { setUser(u); if (pending) { setOrder(pending); setPending(null); setPage("address"); } else setPage("home"); };
  const signOut = () => { setUser(null); setPage("home"); };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{G}</style>
      <Navbar user={user} setPage={setPage} page={page} onSignOut={signOut} />
      {page === "home" && <HomePage onProceed={proceed} />}
      {page === "signin" && <AuthPage onAuth={auth} />}
      {page === "address" && order && <AddressPage onConfirm={a => { setAddress(a); setPage("payment"); }} onBack={() => setPage("home")} />}
      {page === "payment" && order && <PaymentPage order={order} onPay={() => setPage("status")} onBack={() => setPage("address")} />}
      {page === "status" && order && address && <StatusPage order={order} address={address} setPage={setPage} />}
      {page === "orders" && <OrdersPage setPage={setPage} />}
      {page === "account" && <AccountPage user={user} setPage={setPage} onSignOut={signOut} />}
      {page === "about" && <AboutPage />}
      {page === "contact" && <ContactPage />}
      <a href="https://wa.me/91XXXXXXXXXX?text=Hi PrintKaaro!" target="_blank" rel="noopener noreferrer"
        style={{ position: "fixed", bottom: 20, right: 20, width: 50, height: 50, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#fff", boxShadow: "0 4px 16px rgba(37,211,102,.4)", zIndex: 99, textDecoration: "none" }}>💬</a>
      <footer style={{ borderTop: "1px solid #eee", padding: 20, textAlign: "center", marginTop: 32 }}>
        <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>© 2026 PrintKaaro — Professional Print & Delivery</p>
      </footer>
    </div>
  );
}
