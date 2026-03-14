import { useState, useEffect } from "react";

// ─── SAMPLE DATA (replace with real API later) ───
const INITIAL_ORDERS = [
  { id: "PK-20260315-001", customer: "Rahul Sharma", phone: "9876543210", email: "rahul@gmail.com", file: "thesis_final.pdf", pages: 60, copies: 2, colorMode: "color", paperSize: "A4", sided: "double", binding: "Spiral", address: "123 MG Road, Balurghat, WB 733101", price: 1010, payment: "upi", paymentStatus: "captured", status: "confirmed", date: "2026-03-15T10:30:00", notes: "" },
  { id: "PK-20260315-002", customer: "Priya Das", phone: "8765432109", email: "", file: "resume_2026.pdf", pages: 4, copies: 10, colorMode: "color", paperSize: "A4", sided: "single", binding: "No Binding", address: "45 Station Road, Balurghat, WB 733101", price: 360, payment: "razorpay", paymentStatus: "captured", status: "printing", date: "2026-03-15T09:15:00", notes: "Glossy paper if available" },
  { id: "PK-20260314-003", customer: "Amit Roy", phone: "7654321098", email: "amit.roy@email.com", file: "project_report.pdf", pages: 120, copies: 1, colorMode: "bw", paperSize: "A4", sided: "double", binding: "Perfect Bind", address: "78 College Para, Balurghat, WB 733101", price: 228, payment: "upi", paymentStatus: "captured", status: "ready", date: "2026-03-14T16:45:00", notes: "" },
  { id: "PK-20260314-004", customer: "Sneha Ghosh", phone: "6543210987", email: "sneha@gmail.com", file: "wedding_card.pdf", pages: 8, copies: 100, colorMode: "color", paperSize: "A5", sided: "double", binding: "Staple", address: "12 Netaji Subhas Road, Balurghat, WB 733101", price: 5480, payment: "razorpay", paymentStatus: "captured", status: "shipped", date: "2026-03-14T11:20:00", notes: "Need by March 18" },
  { id: "PK-20260313-005", customer: "Kunal Sen", phone: "9988776655", email: "", file: "study_notes_sem6.pdf", pages: 200, copies: 1, colorMode: "bw", paperSize: "A4", sided: "single", binding: "Spiral", address: "56 Hospital Road, Balurghat, WB 733101", price: 465, payment: "upi", paymentStatus: "captured", status: "delivered", date: "2026-03-13T14:00:00", notes: "" },
  { id: "PK-20260313-006", customer: "Diya Sarkar", phone: "8877665544", email: "diya.s@email.com", file: "children_book_draft.pdf", pages: 40, copies: 5, colorMode: "color", paperSize: "A4", sided: "double", binding: "Hardcover", address: "90 Rabindra Sarani, Balurghat, WB 733101", price: 1870, payment: "razorpay", paymentStatus: "captured", status: "delivered", date: "2026-03-13T08:30:00", notes: "Handle with care - gift" },
];

const STATUS_FLOW = ["confirmed", "printing", "ready", "shipped", "delivered"];
const STATUS_CONFIG = {
  confirmed: { label: "Confirmed", color: "#8b5cf6", bg: "#8b5cf615" },
  printing: { label: "Printing", color: "#f59e0b", bg: "#f59e0b15" },
  ready: { label: "Ready", color: "#3b82f6", bg: "#3b82f615" },
  shipped: { label: "Shipped", color: "#0ea5e9", bg: "#0ea5e915" },
  delivered: { label: "Delivered", color: "#22c55e", bg: "#22c55e15" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "#ef444415" },
};

// ─── STAT CARD ───
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #eee", flex: 1, minWidth: 160 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
        <span style={{ fontSize: 12, color: "#999", fontWeight: 600, letterSpacing: 0.5 }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#1a1a2e" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ─── ORDER ROW ───
function OrderRow({ order, onStatusChange, onView }) {
  const sc = STATUS_CONFIG[order.status];
  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #eee", marginBottom: 8, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#FF6B35", fontFamily: "monospace" }}>{order.id}</span>
          <span style={{ fontSize: 11, color: "#ccc" }}>•</span>
          <span style={{ fontSize: 12, color: "#999" }}>{new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{order.customer}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
          {order.file} • {order.pages}p × {order.copies}c • {order.colorMode === "bw" ? "B&W" : "Color"} • {order.paperSize} • {order.binding}
        </div>
        {order.notes && <div style={{ fontSize: 11, color: "#f59e0b", marginTop: 4, fontWeight: 500 }}>📝 {order.notes}</div>}
      </div>

      <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e" }}>₹{order.price}</div>
          <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: sc.bg, color: sc.color, fontWeight: 600 }}>{sc.label}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button onClick={() => onView(order)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #e0e0e0", background: "#fff", color: "#666", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>View</button>
          {nextStatus && (
            <button onClick={() => onStatusChange(order.id, nextStatus)}
              style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: STATUS_CONFIG[nextStatus].color, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              → {STATUS_CONFIG[nextStatus].label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ORDER DETAIL MODAL ───
function OrderDetail({ order, onClose, onStatusChange }) {
  if (!order) return null;
  const sc = STATUS_CONFIG[order.status];
  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: 32, maxWidth: 520, width: "100%", maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20 }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#FF6B35", fontFamily: "monospace" }}>{order.id}</span>
            <p style={{ fontSize: 12, color: "#999", margin: "4px 0 0" }}>{new Date(order.date).toLocaleString("en-IN")}</p>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#f5f5f5", borderRadius: 8, width: 32, height: 32, fontSize: 16, cursor: "pointer", color: "#999" }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 600, marginBottom: 4 }}>CUSTOMER</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>{order.customer}</div>
            <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>📱 {order.phone}</div>
            {order.email && <div style={{ fontSize: 13, color: "#666" }}>✉️ {order.email}</div>}
          </div>
          <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 600, marginBottom: 4 }}>PAYMENT</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#FF6B35" }}>₹{order.price}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{order.payment === "upi" ? "📱 UPI" : "💳 Razorpay"} • Paid</div>
          </div>
        </div>

        <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#999", fontWeight: 600, marginBottom: 8 }}>PRINT DETAILS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 13 }}>
            <div><span style={{ color: "#999" }}>File:</span> <span style={{ color: "#333", fontWeight: 500 }}>{order.file}</span></div>
            <div><span style={{ color: "#999" }}>Pages:</span> <span style={{ color: "#333", fontWeight: 500 }}>{order.pages} × {order.copies} copies</span></div>
            <div><span style={{ color: "#999" }}>Type:</span> <span style={{ color: "#333", fontWeight: 500 }}>{order.colorMode === "bw" ? "B&W" : "Color"}</span></div>
            <div><span style={{ color: "#999" }}>Paper:</span> <span style={{ color: "#333", fontWeight: 500 }}>{order.paperSize} • {order.sided}-sided</span></div>
            <div><span style={{ color: "#999" }}>Binding:</span> <span style={{ color: "#333", fontWeight: 500 }}>{order.binding}</span></div>
          </div>
        </div>

        <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#999", fontWeight: 600, marginBottom: 4 }}>DELIVERY ADDRESS</div>
          <div style={{ fontSize: 13, color: "#333" }}>{order.address}</div>
        </div>

        {order.notes && (
          <div style={{ background: "#FFFAF0", borderRadius: 10, padding: 14, marginBottom: 12, border: "1px solid #FFE8C8" }}>
            <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600, marginBottom: 4 }}>SPECIAL NOTES</div>
            <div style={{ fontSize: 13, color: "#333" }}>{order.notes}</div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
          <span style={{ fontSize: 13, padding: "6px 14px", borderRadius: 20, background: sc.bg, color: sc.color, fontWeight: 600 }}>
            Current: {sc.label}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <a href={`https://wa.me/91${order.phone}?text=Hi ${order.customer}, your PrintKaaro order ${order.id} update:`}
              target="_blank" rel="noopener noreferrer"
              style={{ padding: "8px 16px", borderRadius: 8, background: "#25D366", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              💬 WhatsApp
            </a>
            {nextStatus && (
              <button onClick={() => { onStatusChange(order.id, nextStatus); onClose(); }}
                style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: STATUS_CONFIG[nextStatus].color, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Move to → {STATUS_CONFIG[nextStatus].label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ADMIN DASHBOARD ───
export default function AdminDashboard() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewOrder, setViewOrder] = useState(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [passError, setPassError] = useState("");

  const handleLogin = () => {
    if (adminPass === "admin123") {
      setAdminAuth(true);
      setPassError("");
    } else {
      setPassError("Wrong password. Default: admin123");
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const filtered = orders.filter(o => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch = search === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.file.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.price, 0);
  const todayOrders = orders.filter(o => new Date(o.date).toDateString() === new Date().toDateString()).length;
  const pendingOrders = orders.filter(o => ["confirmed", "printing", "ready"].includes(o.status)).length;

  // ─── Admin Login Gate ───
  if (!adminAuth) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 380, background: "#fff", borderRadius: 20, padding: 40, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg, #FF6B35, #FF8C42)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 14 }}>P</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Admin Dashboard</h2>
            <p style={{ fontSize: 13, color: "#999", marginTop: 4 }}>PrintKaaro Management Panel</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>ADMIN PASSWORD</label>
            <input value={adminPass} onChange={e => setAdminPass(e.target.value)} type="password" placeholder="Enter admin password"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          </div>
          {passError && <p style={{ color: "#e53e3e", fontSize: 12, marginBottom: 12, textAlign: "center" }}>{passError}</p>}
          <button onClick={handleLogin}
            style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #FF6B35, #FF8C42)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
            Login
          </button>
        </div>
      </div>
    );
  }

  // ─── Dashboard ───
  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F7", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top Bar */}
      <div style={{ background: "#1a1a2e", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg, #FF6B35, #FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>P</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>PrintKaaro</span>
          <span style={{ fontSize: 12, color: "#666", marginLeft: 8, padding: "3px 10px", background: "rgba(255,255,255,0.08)", borderRadius: 6 }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>← Back to Store</a>
          <button onClick={() => setAdminAuth(false)} style={{ fontSize: 12, color: "#ef4444", border: "1px solid #ef444430", background: "none", padding: "6px 14px", borderRadius: 6, cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {/* Stats Row */}
        <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
          <StatCard icon="📦" label="TOTAL ORDERS" value={orders.length} sub="All time" color="#3b82f6" />
          <StatCard icon="📋" label="TODAY" value={todayOrders} sub="New orders" color="#8b5cf6" />
          <StatCard icon="⏳" label="PENDING" value={pendingOrders} sub="Need action" color="#f59e0b" />
          <StatCard icon="💰" label="REVENUE" value={`₹${totalRevenue.toLocaleString("en-IN")}`} sub="Total earned" color="#22c55e" />
        </div>

        {/* Filters + Search */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[{ key: "all", label: "All" }, ...STATUS_FLOW.map(s => ({ key: s, label: STATUS_CONFIG[s].label }))].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                style={{
                  padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  border: `1.5px solid ${filter === f.key ? "#FF6B35" : "#e0e0e0"}`,
                  background: filter === f.key ? "#FFF3ED" : "#fff",
                  color: filter === f.key ? "#FF6B35" : "#888"
                }}>
                {f.label} {f.key !== "all" && <span style={{ marginLeft: 4, opacity: 0.6 }}>({orders.filter(o => o.status === f.key).length})</span>}
              </button>
            ))}
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order, name, phone..."
            style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontSize: 13, width: 240, outline: "none" }} />
        </div>

        {/* Orders List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#ccc" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 15 }}>No orders found</p>
          </div>
        ) : (
          filtered.map(order => (
            <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} onView={setViewOrder} />
          ))
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetail order={viewOrder} onClose={() => setViewOrder(null)} onStatusChange={handleStatusChange} />
    </div>
  );
}
