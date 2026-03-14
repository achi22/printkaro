import { useState, useRef, useEffect } from "react";

const SERVICES = [
  {
    id: "bw-doc",
    name: "B&W Document Print",
    icon: "📄",
    pricePerPage: 2,
    unit: "per page",
    description: "Crisp black & white prints on 80gsm paper",
    options: ["A4", "A3", "Legal"],
  },
  {
    id: "color-doc",
    name: "Color Document Print",
    icon: "🎨",
    pricePerPage: 8,
    unit: "per page",
    description: "Vivid full-color prints on premium 100gsm paper",
    options: ["A4", "A3", "Legal"],
  },
  {
    id: "booklet",
    name: "Book / Booklet",
    icon: "📚",
    pricePerPage: 5,
    unit: "per page",
    description: "Perfect-bound or saddle-stitched booklets",
    options: ["A5 Booklet", "A4 Book", "Custom Size"],
    extras: ["Soft Cover (+₹30)", "Hard Cover (+₹120)", "Laminated Cover (+₹50)"],
  },
];

const BINDING_OPTIONS = [
  { id: "none", name: "No Binding", price: 0 },
  { id: "spiral", name: "Spiral Binding", price: 25 },
  { id: "staple", name: "Staple Binding", price: 10 },
  { id: "perfect", name: "Perfect Binding", price: 60 },
  { id: "hardcover", name: "Hardcover", price: 150 },
];

// ─── Animated Background ───
function InkDropBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: "#0a0a0f" }}>
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #ff6b3520 0%, transparent 70%)", animation: "float1 20s ease-in-out infinite" }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #3b82f620 0%, transparent 70%)", animation: "float2 25s ease-in-out infinite" }} />
      <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #a855f720 0%, transparent 70%)", animation: "float3 18s ease-in-out infinite" }} />
      <style>{`
        @keyframes float1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(80px,40px); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-60px,-30px); } }
        @keyframes float3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px,-60px); } }
      `}</style>
    </div>
  );
}

// ─── Navbar ───
function Navbar({ cart, setPage, currentPage }) {
  const totalItems = cart.reduce((s, i) => s + i.copies, 0);
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{ background: "rgba(10,10,15,0.85)", borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <button onClick={() => setPage("home")} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ background: "linear-gradient(135deg, #ff6b35, #ff8c42)", color: "#0a0a0f" }}>
            P
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: "#f0ebe3", fontFamily: "'DM Serif Display', Georgia, serif" }}>
            PrintKaro
          </span>
        </button>
        <div className="flex items-center gap-2">
          {["home", "orders"].map(p => (
            <button key={p} onClick={() => setPage(p)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                color: currentPage === p ? "#ff8c42" : "#8a8a9a",
                background: currentPage === p ? "rgba(255,140,66,0.08)" : "transparent"
              }}>
              {p === "home" ? "Services" : "My Orders"}
            </button>
          ))}
          <button onClick={() => setPage("cart")}
            className="relative ml-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: totalItems > 0 ? "linear-gradient(135deg, #ff6b35, #ff8c42)" : "rgba(255,255,255,0.06)", color: totalItems > 0 ? "#0a0a0f" : "#8a8a9a" }}>
            🛒 Cart {totalItems > 0 && <span className="ml-1">({totalItems})</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Section ───
function Hero() {
  return (
    <div className="text-center py-20 px-6">
      <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wider"
        style={{ background: "rgba(255,107,53,0.12)", color: "#ff8c42", border: "1px solid rgba(255,107,53,0.2)" }}>
        🖨️ UPLOAD → PAY → WE DELIVER
      </div>
      <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        style={{ color: "#f0ebe3", fontFamily: "'DM Serif Display', Georgia, serif" }}>
        Print Anything,<br />
        <span style={{ background: "linear-gradient(135deg, #ff6b35, #ff8c42, #ffa726)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Delivered to You
        </span>
      </h1>
      <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: "#6b6b7b" }}>
        Upload your PDF. Choose print options. Pay with UPI or Razorpay. Get professional prints delivered to your doorstep.
      </p>
      <div className="flex justify-center gap-6 flex-wrap">
        {[
          { icon: "📤", label: "Upload PDF" },
          { icon: "⚙️", label: "Choose Options" },
          { icon: "💳", label: "Pay via UPI" },
          { icon: "📦", label: "Get Delivery" },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
              style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)" }}>
              {step.icon}
            </div>
            <span className="text-sm font-medium" style={{ color: "#8a8a9a" }}>{step.label}</span>
            {i < 3 && <span className="ml-4 text-xs" style={{ color: "#3a3a4a" }}>→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Service Card ───
function ServiceCard({ service, onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <div className="rounded-2xl p-6 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => onSelect(service)}
      style={{
        background: hover ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hover ? "rgba(255,107,53,0.3)" : "rgba(255,255,255,0.06)"}`,
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover ? "0 20px 60px rgba(255,107,53,0.08)" : "none"
      }}>
      <div className="text-4xl mb-4">{service.icon}</div>
      <h3 className="text-xl font-bold mb-2" style={{ color: "#f0ebe3" }}>{service.name}</h3>
      <p className="text-sm mb-4" style={{ color: "#6b6b7b" }}>{service.description}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold" style={{ color: "#ff8c42" }}>₹{service.pricePerPage}</span>
        <span className="text-sm" style={{ color: "#6b6b7b" }}>{service.unit}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {service.options.map(opt => (
          <span key={opt} className="text-xs px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.05)", color: "#8a8a9a" }}>{opt}</span>
        ))}
      </div>
    </div>
  );
}

// ─── PDF Upload & Order Configuration ───
function OrderBuilder({ service, onAddToCart, onBack }) {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState(1);
  const [copies, setCopies] = useState(1);
  const [paperSize, setPaperSize] = useState(service.options[0]);
  const [binding, setBinding] = useState("none");
  const [sided, setSided] = useState("single");
  const [notes, setNotes] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const bindObj = BINDING_OPTIONS.find(b => b.id === binding);
  const sideMultiplier = sided === "double" ? 0.7 : 1;
  const pricePerPage = service.pricePerPage * sideMultiplier;
  const subtotal = Math.ceil(pricePerPage * pages * copies + (bindObj?.price || 0) * copies);

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      // Simulate page count detection
      const fakePages = Math.max(1, Math.floor(f.size / 50000) || 1);
      setPages(fakePages);
    }
  };

  const handleSubmit = () => {
    if (!file) return;
    onAddToCart({
      id: Date.now(),
      service,
      file: file.name,
      pages,
      copies,
      paperSize,
      binding: bindObj.name,
      sided,
      notes,
      price: subtotal,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <button onClick={onBack} className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors"
        style={{ color: "#8a8a9a" }}>
        ← Back to services
      </button>

      <div className="flex items-center gap-4 mb-10">
        <span className="text-4xl">{service.icon}</span>
        <div>
          <h2 className="text-3xl font-bold" style={{ color: "#f0ebe3", fontFamily: "'DM Serif Display', Georgia, serif" }}>{service.name}</h2>
          <p className="text-sm" style={{ color: "#6b6b7b" }}>Configure your print order below</p>
        </div>
      </div>

      {/* PDF Upload Zone */}
      <div
        className="rounded-2xl p-10 text-center mb-8 transition-all cursor-pointer"
        style={{
          border: `2px dashed ${dragOver ? "#ff6b35" : file ? "#22c55e" : "rgba(255,255,255,0.1)"}`,
          background: dragOver ? "rgba(255,107,53,0.05)" : file ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.02)"
        }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
        {file ? (
          <>
            <div className="text-4xl mb-3">✅</div>
            <p className="text-lg font-semibold" style={{ color: "#22c55e" }}>{file.name}</p>
            <p className="text-sm mt-1" style={{ color: "#6b6b7b" }}>
              {(file.size / 1024).toFixed(0)} KB • {pages} page{pages > 1 ? "s" : ""} detected
            </p>
            <p className="text-xs mt-2" style={{ color: "#8a8a9a" }}>Click to change file</p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">📄</div>
            <p className="text-lg font-semibold mb-1" style={{ color: "#f0ebe3" }}>
              Drop your PDF here
            </p>
            <p className="text-sm" style={{ color: "#6b6b7b" }}>or click to browse • PDF files only</p>
          </>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Pages */}
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <label className="text-xs font-semibold mb-2 block" style={{ color: "#8a8a9a" }}>PAGES</label>
          <input type="number" min="1" value={pages} onChange={e => setPages(Math.max(1, +e.target.value))}
            className="w-full p-2 rounded-lg text-lg font-bold" style={{ background: "rgba(0,0,0,0.3)", color: "#f0ebe3", border: "1px solid rgba(255,255,255,0.08)" }} />
        </div>
        {/* Copies */}
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <label className="text-xs font-semibold mb-2 block" style={{ color: "#8a8a9a" }}>COPIES</label>
          <input type="number" min="1" value={copies} onChange={e => setCopies(Math.max(1, +e.target.value))}
            className="w-full p-2 rounded-lg text-lg font-bold" style={{ background: "rgba(0,0,0,0.3)", color: "#f0ebe3", border: "1px solid rgba(255,255,255,0.08)" }} />
        </div>
      </div>

      {/* Paper Size */}
      <div className="mb-4">
        <label className="text-xs font-semibold mb-2 block" style={{ color: "#8a8a9a" }}>PAPER SIZE</label>
        <div className="flex gap-2">
          {service.options.map(opt => (
            <button key={opt} onClick={() => setPaperSize(opt)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: paperSize === opt ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.03)",
                color: paperSize === opt ? "#ff8c42" : "#8a8a9a",
                border: `1px solid ${paperSize === opt ? "rgba(255,107,53,0.3)" : "rgba(255,255,255,0.06)"}`
              }}>{opt}</button>
          ))}
        </div>
      </div>

      {/* Sided */}
      <div className="mb-4">
        <label className="text-xs font-semibold mb-2 block" style={{ color: "#8a8a9a" }}>PRINT SIDE</label>
        <div className="flex gap-2">
          {[{ id: "single", label: "Single Side" }, { id: "double", label: "Both Sides (-30%)" }].map(s => (
            <button key={s.id} onClick={() => setSided(s.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: sided === s.id ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.03)",
                color: sided === s.id ? "#ff8c42" : "#8a8a9a",
                border: `1px solid ${sided === s.id ? "rgba(255,107,53,0.3)" : "rgba(255,255,255,0.06)"}`
              }}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* Binding */}
      <div className="mb-4">
        <label className="text-xs font-semibold mb-2 block" style={{ color: "#8a8a9a" }}>BINDING</label>
        <div className="flex flex-wrap gap-2">
          {BINDING_OPTIONS.map(b => (
            <button key={b.id} onClick={() => setBinding(b.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: binding === b.id ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.03)",
                color: binding === b.id ? "#ff8c42" : "#8a8a9a",
                border: `1px solid ${binding === b.id ? "rgba(255,107,53,0.3)" : "rgba(255,255,255,0.06)"}`
              }}>
              {b.name} {b.price > 0 && <span className="opacity-60">(+₹{b.price})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-8">
        <label className="text-xs font-semibold mb-2 block" style={{ color: "#8a8a9a" }}>SPECIAL INSTRUCTIONS</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="e.g., Print only pages 1-10, landscape orientation..."
          className="w-full p-3 rounded-xl text-sm resize-none" style={{ background: "rgba(0,0,0,0.3)", color: "#f0ebe3", border: "1px solid rgba(255,255,255,0.08)" }} />
      </div>

      {/* Price Summary */}
      <div className="rounded-2xl p-6 mb-6"
        style={{ background: "linear-gradient(135deg, rgba(255,107,53,0.08), rgba(255,140,66,0.04))", border: "1px solid rgba(255,107,53,0.15)" }}>
        <div className="flex justify-between items-center mb-2">
          <span style={{ color: "#8a8a9a" }}>Print cost ({pages}p × {copies}c × ₹{pricePerPage.toFixed(1)})</span>
          <span style={{ color: "#f0ebe3" }}>₹{Math.ceil(pricePerPage * pages * copies)}</span>
        </div>
        {bindObj.price > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span style={{ color: "#8a8a9a" }}>{bindObj.name} × {copies}</span>
            <span style={{ color: "#f0ebe3" }}>₹{bindObj.price * copies}</span>
          </div>
        )}
        <hr style={{ borderColor: "rgba(255,255,255,0.08)" }} className="my-3" />
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold" style={{ color: "#f0ebe3" }}>Total</span>
          <span className="text-2xl font-bold" style={{ color: "#ff8c42" }}>₹{subtotal}</span>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!file}
        className="w-full py-4 rounded-xl text-lg font-bold transition-all"
        style={{
          background: file ? "linear-gradient(135deg, #ff6b35, #ff8c42)" : "rgba(255,255,255,0.05)",
          color: file ? "#0a0a0f" : "#4a4a5a",
          cursor: file ? "pointer" : "not-allowed",
          boxShadow: file ? "0 8px 30px rgba(255,107,53,0.25)" : "none"
        }}>
        {file ? `Add to Cart — ₹${subtotal}` : "Upload a PDF first"}
      </button>
    </div>
  );
}

// ─── Cart Page ───
function CartPage({ cart, setCart, setPage }) {
  const total = cart.reduce((s, i) => s + i.price, 0);
  const deliveryCharge = total > 500 ? 0 : 40;
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);

  const removeItem = (id) => setCart(cart.filter(i => i.id !== id));

  const handlePayment = () => {
    if (!address || !phone) return;
    // Simulate Razorpay payment
    setPaymentDone(true);
    setTimeout(() => {
      setCart([]);
      setPage("orders");
    }, 2500);
  };

  if (paymentDone) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-6" style={{ animation: "pulse 1.5s infinite" }}>✅</div>
        <h2 className="text-3xl font-bold mb-3" style={{ color: "#22c55e", fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Payment Successful!
        </h2>
        <p className="text-lg" style={{ color: "#8a8a9a" }}>Your order has been placed. Redirecting to orders...</p>
        <style>{`@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }`}</style>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: "#f0ebe3" }}>Your cart is empty</h2>
        <button onClick={() => setPage("home")} className="px-6 py-3 rounded-xl font-semibold"
          style={{ background: "linear-gradient(135deg, #ff6b35, #ff8c42)", color: "#0a0a0f" }}>
          Browse Services
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8" style={{ color: "#f0ebe3", fontFamily: "'DM Serif Display', Georgia, serif" }}>
        Your Cart
      </h2>

      {cart.map(item => (
        <div key={item.id} className="rounded-xl p-5 mb-4 flex justify-between items-start"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span>{item.service.icon}</span>
              <span className="font-semibold" style={{ color: "#f0ebe3" }}>{item.service.name}</span>
            </div>
            <p className="text-sm" style={{ color: "#6b6b7b" }}>
              {item.file} • {item.pages}p × {item.copies}c • {item.paperSize} • {item.sided}-sided • {item.binding}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold" style={{ color: "#ff8c42" }}>₹{item.price}</span>
            <button onClick={() => removeItem(item.id)} className="text-sm px-3 py-1 rounded-lg"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>✕</button>
          </div>
        </div>
      ))}

      {/* Delivery Details */}
      <div className="rounded-xl p-6 mt-8 mb-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: "#f0ebe3" }}>Delivery Details</h3>
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Full delivery address"
          className="w-full p-3 rounded-xl text-sm mb-3"
          style={{ background: "rgba(0,0,0,0.3)", color: "#f0ebe3", border: "1px solid rgba(255,255,255,0.08)" }} />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" type="tel"
          className="w-full p-3 rounded-xl text-sm"
          style={{ background: "rgba(0,0,0,0.3)", color: "#f0ebe3", border: "1px solid rgba(255,255,255,0.08)" }} />
      </div>

      {/* Price Summary */}
      <div className="rounded-2xl p-6 mb-6"
        style={{ background: "linear-gradient(135deg, rgba(255,107,53,0.08), rgba(255,140,66,0.04))", border: "1px solid rgba(255,107,53,0.15)" }}>
        <div className="flex justify-between mb-2">
          <span style={{ color: "#8a8a9a" }}>Subtotal</span>
          <span style={{ color: "#f0ebe3" }}>₹{total}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span style={{ color: "#8a8a9a" }}>Delivery</span>
          <span style={{ color: deliveryCharge === 0 ? "#22c55e" : "#f0ebe3" }}>
            {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
          </span>
        </div>
        <hr style={{ borderColor: "rgba(255,255,255,0.08)" }} className="my-3" />
        <div className="flex justify-between">
          <span className="text-lg font-bold" style={{ color: "#f0ebe3" }}>Total</span>
          <span className="text-2xl font-bold" style={{ color: "#ff8c42" }}>₹{total + deliveryCharge}</span>
        </div>
      </div>

      {/* Payment Buttons */}
      <div className="space-y-3">
        <button onClick={handlePayment} disabled={!address || !phone}
          className="w-full py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-3"
          style={{
            background: (address && phone) ? "linear-gradient(135deg, #2563eb, #3b82f6)" : "rgba(255,255,255,0.05)",
            color: (address && phone) ? "#fff" : "#4a4a5a",
            cursor: (address && phone) ? "pointer" : "not-allowed"
          }}>
          <span className="text-xl">💳</span> Pay ₹{total + deliveryCharge} with Razorpay
        </button>
        <button onClick={handlePayment} disabled={!address || !phone}
          className="w-full py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-3"
          style={{
            background: (address && phone) ? "linear-gradient(135deg, #059669, #10b981)" : "rgba(255,255,255,0.05)",
            color: (address && phone) ? "#fff" : "#4a4a5a",
            cursor: (address && phone) ? "pointer" : "not-allowed"
          }}>
          <span className="text-xl">📱</span> Pay ₹{total + deliveryCharge} with UPI
        </button>
      </div>
      {total <= 500 && (
        <p className="text-center text-xs mt-4" style={{ color: "#6b6b7b" }}>
          🚚 Free delivery on orders above ₹500
        </p>
      )}
    </div>
  );
}

// ─── Orders Page ───
function OrdersPage() {
  const sampleOrders = [
    { id: "#PK-20260314-001", date: "14 Mar 2026", status: "Printing", items: "Color Doc — thesis.pdf (60p × 2)", total: "₹1,010", progress: 40 },
    { id: "#PK-20260312-003", date: "12 Mar 2026", status: "Out for Delivery", items: "B&W Doc — notes.pdf (120p × 1)", total: "₹280", progress: 80 },
    { id: "#PK-20260310-007", date: "10 Mar 2026", status: "Delivered", items: "Booklet — manual.pdf (40p × 5)", total: "₹1,350", progress: 100 },
  ];

  const statusColor = { Printing: "#f59e0b", "Out for Delivery": "#3b82f6", Delivered: "#22c55e" };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8" style={{ color: "#f0ebe3", fontFamily: "'DM Serif Display', Georgia, serif" }}>
        My Orders
      </h2>
      {sampleOrders.map(order => (
        <div key={order.id} className="rounded-xl p-5 mb-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="font-mono text-sm font-bold" style={{ color: "#ff8c42" }}>{order.id}</span>
              <span className="text-xs ml-3" style={{ color: "#6b6b7b" }}>{order.date}</span>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: `${statusColor[order.status]}20`, color: statusColor[order.status] }}>
              {order.status}
            </span>
          </div>
          <p className="text-sm mb-3" style={{ color: "#8a8a9a" }}>{order.items}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all" style={{
                width: `${order.progress}%`,
                background: `linear-gradient(90deg, ${statusColor[order.status]}, ${statusColor[order.status]}88)`
              }} />
            </div>
            <span className="text-sm font-bold" style={{ color: "#f0ebe3" }}>{order.total}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main App ───
export default function PrintKaro() {
  const [page, setPage] = useState("home");
  const [selectedService, setSelectedService] = useState(null);
  const [cart, setCart] = useState([]);

  const handleSelectService = (service) => {
    setSelectedService(service);
    setPage("builder");
  };

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
    setPage("cart");
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <InkDropBg />
      <Navbar cart={cart} setPage={setPage} currentPage={page} />

      {page === "home" && (
        <>
          <Hero />
          <div className="max-w-6xl mx-auto px-6 pb-20">
            <h2 className="text-2xl font-bold mb-8" style={{ color: "#f0ebe3", fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICES.map(s => (
                <ServiceCard key={s.id} service={s} onSelect={handleSelectService} />
              ))}
            </div>

            {/* Trust Section */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: "⚡", label: "24hr Turnaround" },
                { icon: "🔒", label: "Secure File Handling" },
                { icon: "📱", label: "UPI & Razorpay" },
                { icon: "🚚", label: "Doorstep Delivery" },
              ].map(t => (
                <div key={t.label} className="py-6">
                  <div className="text-3xl mb-2">{t.icon}</div>
                  <span className="text-sm font-medium" style={{ color: "#8a8a9a" }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {page === "builder" && selectedService && (
        <OrderBuilder service={selectedService} onAddToCart={handleAddToCart} onBack={() => setPage("home")} />
      )}

      {page === "cart" && <CartPage cart={cart} setCart={setCart} setPage={setPage} />}
      {page === "orders" && <OrdersPage />}

      {/* Footer */}
      <footer className="border-t py-8 text-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-sm" style={{ color: "#4a4a5a" }}>
          © 2026 PrintKaro — Professional Print & Delivery Service
        </p>
      </footer>
    </div>
  );
}
