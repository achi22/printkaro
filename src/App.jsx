import { useState, useRef } from "react";
import AdminDashboard from "./Admin.jsx";

// ─── CONFIG ───
const BINDING_OPTIONS = [
  { id: "none", name: "No Binding", price: 0, icon: "📋" },
  { id: "spiral", name: "Spiral", price: 25, icon: "🔗" },
  { id: "staple", name: "Staple", price: 10, icon: "📌" },
  { id: "perfect", name: "Perfect Bind", price: 60, icon: "📖" },
  { id: "hardcover", name: "Hardcover", price: 150, icon: "📕" },
];

// ─── NAVBAR ───
function Navbar({ user, setPage, currentPage, onSignOut }) {
  return (
    <nav style={{ background: "#fff", borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px" }}>
        <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 10, border: "none", background: "none", cursor: "pointer" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #FF6B35, #FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18 }}>P</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", fontFamily: "'DM Serif Display', Georgia, serif" }}>PrintKaro</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {[
            { key: "home", label: "Home" },
            { key: "orders", label: "My Orders" },
          ].map(p => (
            <button key={p.key} onClick={() => setPage(p.key)}
              style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer",
                background: currentPage === p.key ? "#FFF3ED" : "transparent",
                color: currentPage === p.key ? "#FF6B35" : "#666" }}>
              {p.label}
            </button>
          ))}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #FF6B35, #FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 600 }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>{user.name}</span>
              <button onClick={onSignOut} style={{ fontSize: 12, color: "#999", border: "none", background: "none", cursor: "pointer" }}>Sign out</button>
            </div>
          ) : (
            <button onClick={() => setPage("signin")}
              style={{ marginLeft: 8, padding: "8px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "2px solid #FF6B35", background: "#fff", color: "#FF6B35", cursor: "pointer" }}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── SIGN IN / SIGN UP ───
function AuthPage({ onAuth, setPage }) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (mode === "signup" && !name.trim()) return setError("Please enter your name");
    if (!phone.trim() || phone.length < 10) return setError("Please enter a valid phone number");
    if (!password.trim() || password.length < 4) return setError("Password must be at least 4 characters");
    onAuth({ name: name || phone, email, phone, id: Date.now() });
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "linear-gradient(135deg, #FFF9F5 0%, #FFF0E8 100%)" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 20, padding: 40, boxShadow: "0 20px 60px rgba(255,107,53,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #FF6B35, #FF8C42)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, fontWeight: 800, marginBottom: 16 }}>P</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e", margin: 0, fontFamily: "'DM Serif Display', Georgia, serif" }}>
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ fontSize: 14, color: "#888", marginTop: 6 }}>
            {mode === "signin" ? "Sign in to track your orders" : "Join PrintKaro for easy printing"}
          </p>
        </div>

        {mode === "signup" && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>FULL NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>PHONE NUMBER</label>
          <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e0e0e0", borderRadius: 10, overflow: "hidden" }}>
            <span style={{ padding: "12px 12px", background: "#f8f8f8", fontSize: 14, color: "#666", borderRight: "1px solid #e0e0e0" }}>+91</span>
            <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" type="tel"
              style={{ flex: 1, padding: "12px 16px", border: "none", fontSize: 15, outline: "none" }} />
          </div>
        </div>

        {mode === "signup" && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>EMAIL (OPTIONAL)</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>PASSWORD</label>
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" type="password"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>

        {error && <p style={{ color: "#e53e3e", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{error}</p>}

        <button onClick={handleSubmit}
          style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #FF6B35, #FF8C42)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(255,107,53,0.3)" }}>
          {mode === "signin" ? "Sign In" : "Create Account"}
        </button>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#888" }}>
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
            style={{ color: "#FF6B35", fontWeight: 600, border: "none", background: "none", cursor: "pointer", fontSize: 14 }}>
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── OPTION PILL ───
function Pill({ label, active, onClick, sub }) {
  return (
    <button onClick={onClick} style={{
      padding: sub ? "8px 14px" : "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer",
      border: `1.5px solid ${active ? "#FF6B35" : "#e0e0e0"}`,
      background: active ? "#FFF3ED" : "#fff",
      color: active ? "#FF6B35" : "#555",
      transition: "all 0.15s"
    }}>
      {label}
    </button>
  );
}

// ─── PROGRESS BAR ───
function ProgressBar({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {["Upload", "Address", "Payment", "Done"].map((s, i) => (
        <div key={s} style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700,
              background: i <= step ? "linear-gradient(135deg, #FF6B35, #FF8C42)" : "#eee",
              color: i <= step ? "#fff" : "#bbb"
            }}>{i + 1}</div>
            <span style={{ fontSize: 11, marginTop: 4, color: i <= step ? "#FF6B35" : "#bbb", fontWeight: 500 }}>{s}</span>
          </div>
          {i < 3 && <div style={{ flex: 1, height: 2, background: i < step ? "#FF6B35" : "#eee", margin: "0 -8px", marginBottom: 18 }} />}
        </div>
      ))}
    </div>
  );
}

// ─── HOME PAGE: UPLOAD + OPTIONS ───
function HomePage({ onProceed }) {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState(1);
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState("bw");
  const [paperSize, setPaperSize] = useState("A4");
  const [sided, setSided] = useState("single");
  const [binding, setBinding] = useState("none");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const pricePerPage = colorMode === "bw" ? 2 : colorMode === "color" ? 8 : 5;
  const sideMultiplier = sided === "double" ? 0.7 : 1;
  const bindObj = BINDING_OPTIONS.find(b => b.id === binding);
  const subtotal = Math.ceil(pricePerPage * sideMultiplier * pages * copies + (bindObj?.price || 0) * copies);
  const delivery = subtotal >= 500 ? 0 : 40;

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setPages(Math.max(1, Math.floor(f.size / 50000) || 1));
    }
  };

  const handleProceed = () => {
    if (!file) return;
    onProceed({ file: file.name, pages, copies, colorMode, paperSize, sided, binding: bindObj.name, price: subtotal });
  };

  return (
    <div style={{ background: "linear-gradient(180deg, #FFF9F5 0%, #FFFFFF 40%)", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", padding: "48px 24px 24px" }}>
        <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#FFF3ED", color: "#FF6B35", marginBottom: 16, letterSpacing: 1 }}>
          UPLOAD &rarr; CONFIGURE &rarr; PAY &rarr; DELIVERED
        </div>
        <h1 style={{ fontSize: 44, fontWeight: 700, color: "#1a1a2e", margin: "0 0 10px", lineHeight: 1.15, fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Get Your Documents<br /><span style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C42)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Printed & Delivered</span>
        </h1>
        <p style={{ fontSize: 16, color: "#888", maxWidth: 480, margin: "0 auto" }}>Upload your PDF, choose print options, and we deliver professional prints to your doorstep.</p>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 60px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}>
        <div>
          {/* Upload Zone */}
          <div onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            style={{
              border: `2px dashed ${dragOver ? "#FF6B35" : file ? "#22c55e" : "#d0d0d0"}`,
              borderRadius: 16, padding: "40px 24px", textAlign: "center", cursor: "pointer",
              background: dragOver ? "#FFF8F4" : file ? "#F0FDF4" : "#FAFAFA",
              transition: "all 0.2s", marginBottom: 24
            }}>
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            {file ? (
              <>
                <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                <p style={{ fontSize: 17, fontWeight: 600, color: "#16a34a", margin: 0 }}>{file.name}</p>
                <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{(file.size / 1024).toFixed(0)} KB &bull; {pages} page{pages > 1 ? "s" : ""} detected</p>
                <p style={{ fontSize: 12, color: "#aaa", marginTop: 8 }}>Click to change file</p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48, marginBottom: 8 }}>📄</div>
                <p style={{ fontSize: 17, fontWeight: 600, color: "#333", margin: 0 }}>Drop your PDF here</p>
                <p style={{ fontSize: 13, color: "#999", marginTop: 4 }}>or click to browse &bull; PDF files only &bull; Max 50MB</p>
              </>
            )}
          </div>

          {/* Print Options */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #eee" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", margin: "0 0 20px" }}>Print Options</h3>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#999", display: "block", marginBottom: 8, letterSpacing: 0.5 }}>PRINT TYPE</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Pill label="B&W (₹2/pg)" active={colorMode === "bw"} onClick={() => setColorMode("bw")} />
                <Pill label="Color (₹8/pg)" active={colorMode === "color"} onClick={() => setColorMode("color")} />
                <Pill label="Booklet (₹5/pg)" active={colorMode === "booklet"} onClick={() => setColorMode("booklet")} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#999", display: "block", marginBottom: 8, letterSpacing: 0.5 }}>PAPER SIZE</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["A4", "A3", "Legal", "A5"].map(s => (
                  <Pill key={s} label={s} active={paperSize === s} onClick={() => setPaperSize(s)} />
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#999", display: "block", marginBottom: 8, letterSpacing: 0.5 }}>PRINT SIDE</label>
              <div style={{ display: "flex", gap: 8 }}>
                <Pill label="Single Side" active={sided === "single"} onClick={() => setSided("single")} />
                <Pill label="Both Sides (-30%)" active={sided === "double"} onClick={() => setSided("double")} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#999", display: "block", marginBottom: 6 }}>PAGES</label>
                <input type="number" min="1" value={pages} onChange={e => setPages(Math.max(1, +e.target.value))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 16, fontWeight: 600, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#999", display: "block", marginBottom: 6 }}>COPIES</label>
                <input type="number" min="1" value={copies} onChange={e => setCopies(Math.max(1, +e.target.value))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 16, fontWeight: 600, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#999", display: "block", marginBottom: 8, letterSpacing: 0.5 }}>BINDING</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {BINDING_OPTIONS.map(b => (
                  <Pill key={b.id} label={`${b.icon} ${b.name}${b.price > 0 ? ` +₹${b.price}` : ""}`} active={binding === b.id} onClick={() => setBinding(b.id)} sub />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sticky Price Summary */}
        <div style={{ position: "sticky", top: 80 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #eee", boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 16px" }}>Order Summary</h3>
            {file ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#F0FDF4", borderRadius: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 20 }}>📄</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#333", margin: 0 }}>{file.name}</p>
                    <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{pages}p &bull; {copies}c &bull; {paperSize} &bull; {colorMode === "bw" ? "B&W" : colorMode === "color" ? "Color" : "Booklet"}</p>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "#666" }}>
                    <span>Printing ({pages}p × {copies}c)</span>
                    <span style={{ fontWeight: 600, color: "#333" }}>₹{Math.ceil(pricePerPage * sideMultiplier * pages * copies)}</span>
                  </div>
                  {bindObj.price > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "#666" }}>
                      <span>{bindObj.name} × {copies}</span>
                      <span style={{ fontWeight: 600, color: "#333" }}>₹{bindObj.price * copies}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "#666" }}>
                    <span>Delivery</span>
                    <span style={{ fontWeight: 600, color: delivery === 0 ? "#16a34a" : "#333" }}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
                  </div>
                </div>
                <div style={{ borderTop: "2px solid #FF6B35", paddingTop: 12, marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Total</span>
                  <span style={{ fontSize: 28, fontWeight: 800, color: "#FF6B35" }}>₹{subtotal + delivery}</span>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#ccc" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
                <p style={{ fontSize: 13, margin: 0 }}>Upload a PDF to see pricing</p>
              </div>
            )}
            <button onClick={handleProceed} disabled={!file}
              style={{
                width: "100%", padding: 14, borderRadius: 12, border: "none", marginTop: 16,
                background: file ? "linear-gradient(135deg, #FF6B35, #FF8C42)" : "#e0e0e0",
                color: file ? "#fff" : "#999", fontSize: 16, fontWeight: 700, cursor: file ? "pointer" : "not-allowed",
                boxShadow: file ? "0 4px 20px rgba(255,107,53,0.3)" : "none"
              }}>
              {file ? "Proceed to Checkout →" : "Upload a PDF first"}
            </button>
            {subtotal > 0 && subtotal < 500 && (
              <p style={{ fontSize: 11, color: "#999", textAlign: "center", marginTop: 8 }}>Add ₹{500 - subtotal} more for free delivery</p>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
            {[
              { icon: "⚡", text: "24hr Turnaround" },
              { icon: "🔒", text: "Secure Files" },
              { icon: "📱", text: "UPI & Razorpay" },
              { icon: "🚚", text: "Home Delivery" },
            ].map(t => (
              <div key={t.text} style={{ background: "#fff", borderRadius: 10, padding: "10px 12px", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>{t.icon}</span>
                <span style={{ fontSize: 11, color: "#888", fontWeight: 500 }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADDRESS PAGE ───
function AddressPage({ onConfirm, onBack }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");
  const valid = name && phone.length >= 10 && address && city && pincode.length >= 6;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px" }}>
      <button onClick={onBack} style={{ border: "none", background: "none", color: "#888", fontSize: 14, cursor: "pointer", marginBottom: 20, fontWeight: 500 }}>← Back</button>
      <ProgressBar step={1} />
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px", fontFamily: "'DM Serif Display', Georgia, serif" }}>Delivery Address</h2>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Where should we deliver your prints?</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#999", display: "block", marginBottom: 6 }}>FULL NAME</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#999", display: "block", marginBottom: 6 }}>PHONE</label>
          <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#999", display: "block", marginBottom: 6 }}>PINCODE</label>
          <input value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="733101"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#999", display: "block", marginBottom: 6 }}>FULL ADDRESS</label>
          <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} placeholder="House no, Street, Locality"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", resize: "none", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#999", display: "block", marginBottom: 6 }}>CITY</label>
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="Balurghat"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#999", display: "block", marginBottom: 6 }}>STATE</label>
          <input value="West Bengal" disabled
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, background: "#f8f8f8", color: "#666", boxSizing: "border-box" }} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#999", display: "block", marginBottom: 6 }}>SPECIAL INSTRUCTIONS (OPTIONAL)</label>
          <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g., Print only pages 1-10, landscape..."
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>
      <button onClick={() => valid && onConfirm({ name, phone, address, city, pincode, notes })} disabled={!valid}
        style={{
          width: "100%", padding: 14, borderRadius: 12, border: "none", marginTop: 24,
          background: valid ? "linear-gradient(135deg, #FF6B35, #FF8C42)" : "#e0e0e0",
          color: valid ? "#fff" : "#999", fontSize: 16, fontWeight: 700, cursor: valid ? "pointer" : "not-allowed",
          boxShadow: valid ? "0 4px 20px rgba(255,107,53,0.3)" : "none"
        }}>
        Proceed to Payment →
      </button>
    </div>
  );
}

// ─── PAYMENT PAGE ───
function PaymentPage({ order, onPay, onBack }) {
  const [method, setMethod] = useState("upi");
  const delivery = order.price >= 500 ? 0 : 40;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px" }}>
      <button onClick={onBack} style={{ border: "none", background: "none", color: "#888", fontSize: 14, cursor: "pointer", marginBottom: 20, fontWeight: 500 }}>← Back</button>
      <ProgressBar step={2} />
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px", fontFamily: "'DM Serif Display', Georgia, serif" }}>Payment</h2>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Choose your preferred payment method</p>

      <div style={{ background: "#FFFAF7", borderRadius: 14, padding: 20, border: "1px solid #FFE8D9", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "#666" }}>
          <span>📄 {order.file}</span>
          <span style={{ fontWeight: 600, color: "#333" }}>{order.pages}p × {order.copies}c</span>
        </div>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
          {order.colorMode === "bw" ? "B&W" : order.colorMode === "color" ? "Color" : "Booklet"} &bull; {order.paperSize} &bull; {order.sided}-sided &bull; {order.binding}
        </div>
        <div style={{ borderTop: "1px dashed #FFD5BE", paddingTop: 10, marginTop: 10, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Total</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: "#FF6B35" }}>₹{order.price + delivery}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {[
          { id: "upi", icon: "📱", label: "UPI (Google Pay / PhonePe / Paytm)", desc: "Instant payment via UPI" },
          { id: "razorpay", icon: "💳", label: "Razorpay (Card / Netbanking / Wallet)", desc: "All payment options" },
        ].map(m => (
          <button key={m.id} onClick={() => setMethod(m.id)}
            style={{
              display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderRadius: 12, cursor: "pointer",
              border: `2px solid ${method === m.id ? "#FF6B35" : "#eee"}`,
              background: method === m.id ? "#FFF8F4" : "#fff", textAlign: "left"
            }}>
            <span style={{ fontSize: 28 }}>{m.icon}</span>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#333", margin: 0 }}>{m.label}</p>
              <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{m.desc}</p>
            </div>
            <div style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", border: `2px solid ${method === m.id ? "#FF6B35" : "#ddd"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {method === m.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF6B35" }} />}
            </div>
          </button>
        ))}
      </div>

      <button onClick={() => onPay(method)}
        style={{
          width: "100%", padding: 16, borderRadius: 12, border: "none",
          background: method === "upi" ? "linear-gradient(135deg, #059669, #10b981)" : "linear-gradient(135deg, #2563eb, #3b82f6)",
          color: "#fff", fontSize: 17, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
        {method === "upi" ? "📱" : "💳"} Pay ₹{order.price + delivery}
      </button>
      <p style={{ textAlign: "center", fontSize: 12, color: "#bbb", marginTop: 12 }}>🔒 Secured by Razorpay &bull; 256-bit SSL encrypted</p>
    </div>
  );
}

// ─── ORDER STATUS PAGE ───
function OrderStatusPage({ order, address, setPage }) {
  const orderId = `#PK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`;
  const delivery = order.price >= 500 ? 0 : 40;
  const steps = [
    { label: "Order Placed", time: "Just now", done: true, icon: "✅" },
    { label: "Payment Confirmed", time: "Just now", done: true, icon: "💳" },
    { label: "Printing", time: "Estimated 2-4 hrs", done: false, icon: "🖨️" },
    { label: "Ready for Dispatch", time: "", done: false, icon: "📦" },
    { label: "Out for Delivery", time: "", done: false, icon: "🚚" },
    { label: "Delivered", time: "", done: false, icon: "🏠" },
  ];

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px" }}>
      <ProgressBar step={3} />
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#fff", marginBottom: 16 }}>✓</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px", fontFamily: "'DM Serif Display', Georgia, serif" }}>Order Confirmed!</h2>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>Order {orderId}</p>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
          <span style={{ color: "#888" }}>File</span><span style={{ fontWeight: 600, color: "#333" }}>{order.file}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
          <span style={{ color: "#888" }}>Options</span><span style={{ color: "#333" }}>{order.pages}p × {order.copies}c &bull; {order.paperSize} &bull; {order.colorMode === "bw" ? "B&W" : "Color"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
          <span style={{ color: "#888" }}>Deliver to</span><span style={{ color: "#333", textAlign: "right", maxWidth: 240 }}>{address.address}, {address.city} - {address.pincode}</span>
        </div>
        <div style={{ borderTop: "1.5px solid #f0f0f0", paddingTop: 10, marginTop: 10, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>Total Paid</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#FF6B35" }}>₹{order.price + delivery}</span>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #eee", marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 20px" }}>Order Status</h3>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, background: step.done ? "#F0FDF4" : "#f8f8f8", border: `2px solid ${step.done ? "#22c55e" : "#e0e0e0"}`
              }}>{step.icon}</div>
              {i < steps.length - 1 && <div style={{ width: 2, height: 32, background: step.done ? "#22c55e" : "#e0e0e0" }} />}
            </div>
            <div style={{ paddingBottom: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: step.done ? "#333" : "#bbb", margin: 0 }}>{step.label}</p>
              {step.time && <p style={{ fontSize: 12, color: step.done ? "#16a34a" : "#ccc", margin: "2px 0 0" }}>{step.time}</p>}
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setPage("home")}
        style={{ width: "100%", padding: 14, borderRadius: 12, border: "2px solid #FF6B35", background: "#fff", color: "#FF6B35", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
        + Place Another Order
      </button>
      <p style={{ textAlign: "center", fontSize: 13, color: "#999", marginTop: 12 }}>You'll receive updates via WhatsApp/SMS</p>
    </div>
  );
}

// ─── MY ORDERS PAGE ───
function OrdersPage({ setPage }) {
  const sampleOrders = [
    { id: "#PK-20260314-001", date: "14 Mar 2026", status: "Printing", items: "Color — thesis.pdf (60p × 2)", total: "₹1,010", progress: 40, statusColor: "#f59e0b" },
    { id: "#PK-20260312-003", date: "12 Mar 2026", status: "Out for Delivery", items: "B&W — notes.pdf (120p × 1)", total: "₹280", progress: 80, statusColor: "#3b82f6" },
    { id: "#PK-20260310-007", date: "10 Mar 2026", status: "Delivered", items: "Booklet — manual.pdf (40p × 5)", total: "₹1,350", progress: 100, statusColor: "#22c55e" },
  ];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1a1a2e", margin: "0 0 24px", fontFamily: "'DM Serif Display', Georgia, serif" }}>My Orders</h2>
      {sampleOrders.map(order => (
        <div key={order.id} style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 10 }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#FF6B35", fontFamily: "monospace" }}>{order.id}</span>
              <span style={{ fontSize: 12, color: "#bbb", marginLeft: 10 }}>{order.date}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: `${order.statusColor}15`, color: order.statusColor }}>{order.status}</span>
          </div>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 10px" }}>{order.items}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: "#f0f0f0", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, width: `${order.progress}%`, background: `linear-gradient(90deg, ${order.statusColor}, ${order.statusColor}88)` }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#333" }}>{order.total}</span>
          </div>
        </div>
      ))}
      <button onClick={() => setPage("home")}
        style={{ width: "100%", padding: 14, borderRadius: 12, border: "2px solid #FF6B35", background: "#fff", color: "#FF6B35", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 12 }}>
        + New Order
      </button>
    </div>
  );
}

// ─── MAIN APP ───
export default function PrintKaro() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [address, setAddress] = useState(null);
  const [pendingOrder, setPendingOrder] = useState(null);

  const handleProceed = (orderData) => {
    if (!user) {
      setPendingOrder(orderData);
      setPage("signin");
    } else {
      setOrder(orderData);
      setPage("address");
    }
  };

  const handleAuth = (userData) => {
    setUser(userData);
    if (pendingOrder) {
      setOrder(pendingOrder);
      setPendingOrder(null);
      setPage("address");
    } else {
      setPage("home");
    }
  };

  // Check if URL has #admin
  const isAdmin = typeof window !== "undefined" && window.location.hash === "#admin";
  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <Navbar user={user} setPage={setPage} currentPage={page} onSignOut={() => { setUser(null); setPage("home"); }} />
      {page === "home" && <HomePage onProceed={handleProceed} />}
      {page === "signin" && <AuthPage onAuth={handleAuth} setPage={setPage} />}
      {page === "address" && order && <AddressPage onConfirm={(addr) => { setAddress(addr); setPage("payment"); }} onBack={() => setPage("home")} />}
      {page === "payment" && order && <PaymentPage order={order} onPay={() => setPage("status")} onBack={() => setPage("address")} />}
      {page === "status" && order && address && <OrderStatusPage order={order} address={address} setPage={setPage} />}
      {page === "orders" && <OrdersPage setPage={setPage} />}

      {/* WhatsApp Floating Button */}
      <a href="https://wa.me/9239226708?text=Hi! I want to place a print order on PrintKaaro"
        target="_blank" rel="noopener noreferrer"
        style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", boxShadow: "0 4px 20px rgba(37,211,102,0.4)", zIndex: 99, textDecoration: "none" }}>
        💬
      </a>

      <footer style={{ borderTop: "1px solid #eee", padding: 24, textAlign: "center", marginTop: 40 }}>
        <p style={{ fontSize: 13, color: "#bbb", margin: 0 }}>© 2026 PrintKaaro — Professional Print & Delivery Service</p>
      </footer>
    </div>
  );
}
