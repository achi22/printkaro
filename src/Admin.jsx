import { useState, useEffect } from "react";
import * as api from "./api.js";

const STATUS_FLOW = ["confirmed", "printing", "ready", "shipped", "delivered"];
const SC = {
  confirmed: { label: "Confirmed", color: "#8b5cf6", bg: "#8b5cf615" },
  printing: { label: "Printing", color: "#f59e0b", bg: "#f59e0b15" },
  ready: { label: "Ready", color: "#3b82f6", bg: "#3b82f615" },
  shipped: { label: "Shipped", color: "#0ea5e9", bg: "#0ea5e915" },
  delivered: { label: "Delivered", color: "#22c55e", bg: "#22c55e15" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "#ef444415" },
  pending: { label: "Pending", color: "#999", bg: "#99999915" },
};
const inp = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" };
const lbl = { fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 4 };

function Modal({ children, onClose, title, wide }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: wide ? 680 : 500, width: "100%", maxHeight: "88vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ border: "none", background: "#f5f5f5", borderRadius: 8, width: 30, height: 30, fontSize: 14, cursor: "pointer", color: "#999" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, onClick }) {
  return (
    <div onClick={onClick} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: "1px solid #eee", flex: 1, minWidth: 130, cursor: onClick ? "pointer" : "default" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{icon}</div>
        <span style={{ fontSize: 10, color: "#999", fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: "#999", marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

function RevenueChart({ stats }) {
  const data = stats.dailyRevenue || [];
  const maxRev = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #eee", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Revenue (Last 7 Days)</h3>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#22c55e" }}>₹{stats.totalRevenue?.toLocaleString("en-IN") || 0}</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
        {data.length === 0 ? <p style={{ color: "#ccc", fontSize: 12, margin: "auto" }}>No data yet</p> :
          data.map(d => {
            const h = Math.max((d.revenue / maxRev) * 100, 4);
            return (
              <div key={d._id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: "#666" }}>{d.revenue > 0 ? `₹${d.revenue}` : ""}</span>
                <div style={{ width: "100%", height: h, borderRadius: "4px 4px 2px 2px", background: d.revenue > 0 ? "linear-gradient(180deg, #FF6B35, #FF8C42)" : "#f0f0f0" }} />
                <span style={{ fontSize: 8, color: "#999" }}>{d._id?.slice(5)}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function StatusBreakdown({ stats }) {
  const data = stats.statusBreakdown || [];
  const total = stats.totalOrders || 1;
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #eee", marginBottom: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>Status Breakdown</h3>
      {data.length === 0 ? <p style={{ color: "#ccc", fontSize: 12 }}>No orders yet</p> :
        data.map(d => {
          const s = SC[d._id] || SC.pending;
          const pct = Math.round((d.count / total) * 100);
          return (
            <div key={d._id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                <span style={{ color: s.color, fontWeight: 600 }}>{s.label}</span>
                <span style={{ color: "#999" }}>{d.count} ({pct}%)</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: "#f0f0f0" }}>
                <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: s.color }} />
              </div>
            </div>
          );
        })}
    </div>
  );
}

function printInvoice(order) {
  const addr = order.deliveryAddress || {};
  const w = window.open("", "_blank", "width=400,height=600");
  w.document.write(`<!DOCTYPE html><html><head><title>Invoice ${order.orderId}</title><style>body{font-family:Arial;padding:20px;max-width:360px;margin:0 auto;font-size:13px;color:#333}h2{text-align:center;color:#FF6B35;margin:0 0 4px}.sub{text-align:center;color:#999;font-size:11px;margin:0 0 16px}.line{border-top:1px dashed #ddd;margin:10px 0}.row{display:flex;justify-content:space-between;margin:3px 0}.total{font-size:18px;font-weight:800;color:#FF6B35}.footer{text-align:center;color:#bbb;font-size:10px;margin-top:16px}</style></head><body><h2>PrintKaaro</h2><p class="sub">printkaaro.in</p><div class="line"></div><div class="row"><span>Order:</span><strong>${order.orderId}</strong></div><div class="row"><span>Date:</span><span>${new Date(order.createdAt).toLocaleDateString("en-IN")}</span></div><div class="row"><span>Customer:</span><span>${addr.name || "N/A"}</span></div><div class="row"><span>Phone:</span><span>${addr.phone || "N/A"}</span></div><div class="line"></div><div class="row"><span>File:</span><span>${order.fileName}</span></div><div class="row"><span>Pages:</span><span>${order.pages} x ${order.copies}c</span></div><div class="row"><span>Type:</span><span>${order.colorMode === "bw" ? "B&W" : "Color"} | ${order.paperSize} | ${order.sided}</span></div><div class="row"><span>Binding:</span><span>${order.binding}</span></div><div class="line"></div><div class="row"><span>Subtotal:</span><span>₹${order.price}</span></div><div class="row"><span>Delivery:</span><span>₹${order.deliveryCharge || 0}</span></div><div class="line"></div><div class="row"><span class="total">Total:</span><span class="total">₹${order.totalPrice}</span></div><div class="row"><span>Payment:</span><span>${order.paymentMethod} | ${order.paymentStatus}</span></div><div class="line"></div><p>${addr.address || ""}, ${addr.city || ""} - ${addr.pincode || ""}</p><div class="footer"><p>Thank you for choosing PrintKaaro!</p></div><script>window.onload=()=>window.print()</script></body></html>`);
  w.document.close();
}

function OrderDetail({ order, onClose, onUpdate, onCancel, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [ed, setEd] = useState({});
  const [showCancel, setShowCancel] = useState(false);
  const [trackingId, setTrackingId] = useState(order.trackingId || "");
  const [partner, setPartner] = useState(order.deliveryPartner || "");
  const [saving, setSaving] = useState(false);
  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];
  const sc = SC[order.status] || SC.pending;
  const addr = order.deliveryAddress || {};
  const user = order.user || {};

  useEffect(() => { setEd({ pages: order.pages, copies: order.copies, colorMode: order.colorMode, paperSize: order.paperSize, binding: order.binding, price: order.price, totalPrice: order.totalPrice, notes: order.notes }); }, [order]);

  const saveEdit = async () => { setSaving(true); try { await api.updateOrder(order._id, ed); onRefresh(); setEditing(false); } catch (e) { alert(e.message); } setSaving(false); };
  const saveTracking = async () => { setSaving(true); try { await api.updateOrder(order._id, { trackingId, deliveryPartner: partner }); onRefresh(); } catch (e) { alert(e.message); } setSaving(false); };
  const changeStatus = async (s) => { setSaving(true); try { await api.updateOrderStatus(order._id, s); onRefresh(); onClose(); } catch (e) { alert(e.message); } setSaving(false); };
  const cancelOrder = async () => { setSaving(true); try { await api.updateOrderStatus(order._id, "cancelled", "Cancelled by admin"); onRefresh(); onClose(); } catch (e) { alert(e.message); } setSaving(false); };

  return (
    <Modal onClose={onClose} title={`Order ${order.orderId}`} wide>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {order.filePath && <a href={api.getAdminPdfUrl(order._id)} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #3b82f6", background: "#EFF6FF", color: "#3b82f6", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>📄 Download PDF</a>}
        <button onClick={() => printInvoice(order)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>🧾 Invoice</button>
        <button onClick={() => setEditing(!editing)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ddd", background: editing ? "#FFF3ED" : "#fff", color: editing ? "#FF6B35" : "#333", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>✏️ {editing ? "Cancel" : "Edit"}</button>
        <a href={`https://wa.me/91${addr.phone || user.phone}?text=Hi ${addr.name || user.name}, your PrintKaaro order ${order.orderId} update:`} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 12px", borderRadius: 6, background: "#25D366", color: "#fff", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>💬 WhatsApp</a>
        {order.status !== "cancelled" && order.status !== "delivered" && <button onClick={() => setShowCancel(true)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ef4444", background: "#fff", color: "#ef4444", fontSize: 11, fontWeight: 600, cursor: "pointer", marginLeft: "auto" }}>Cancel</button>}
      </div>

      {showCancel && <div style={{ background: "#FEF2F2", borderRadius: 8, padding: 14, marginBottom: 12, border: "1px solid #FECACA" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#ef4444", margin: "0 0 8px" }}>Cancel this order?</p>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={cancelOrder} disabled={saving} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: "#ef4444", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Yes, Cancel</button>
          <button onClick={() => setShowCancel(false)} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>No</button>
        </div>
      </div>}

      {editing ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div><label style={lbl}>PAGES</label><input type="number" value={ed.pages} onChange={e => setEd({ ...ed, pages: +e.target.value })} style={inp} /></div>
          <div><label style={lbl}>COPIES</label><input type="number" value={ed.copies} onChange={e => setEd({ ...ed, copies: +e.target.value })} style={inp} /></div>
          <div><label style={lbl}>COLOR</label><select value={ed.colorMode} onChange={e => setEd({ ...ed, colorMode: e.target.value })} style={inp}><option value="bw">B&W</option><option value="color">Color</option><option value="booklet">Booklet</option></select></div>
          <div><label style={lbl}>PAPER</label><select value={ed.paperSize} onChange={e => setEd({ ...ed, paperSize: e.target.value })} style={inp}><option>A4</option><option>A3</option><option>A5</option><option>Legal</option></select></div>
          <div><label style={lbl}>BINDING</label><input value={ed.binding} onChange={e => setEd({ ...ed, binding: e.target.value })} style={inp} /></div>
          <div><label style={lbl}>PRICE ₹</label><input type="number" value={ed.totalPrice} onChange={e => setEd({ ...ed, totalPrice: +e.target.value, price: +e.target.value })} style={inp} /></div>
          <div style={{ gridColumn: "1/-1" }}><label style={lbl}>NOTES</label><input value={ed.notes || ""} onChange={e => setEd({ ...ed, notes: e.target.value })} style={inp} /></div>
          <div style={{ gridColumn: "1/-1" }}><button onClick={saveEdit} disabled={saving} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save Changes"}</button></div>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 12 }}>
              <div style={lbl}>CUSTOMER</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{addr.name || user.name || "N/A"}</div>
              <div style={{ fontSize: 12, color: "#666" }}>📱 {addr.phone || user.phone || "N/A"}</div>
              {user.email && <div style={{ fontSize: 12, color: "#666" }}>✉️ {user.email}</div>}
            </div>
            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 12 }}>
              <div style={lbl}>PAYMENT</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#FF6B35" }}>₹{order.totalPrice}</div>
              <div style={{ fontSize: 11, color: "#666" }}>{order.paymentMethod} • {order.paymentStatus}</div>
            </div>
          </div>

          <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={lbl}>PRINT DETAILS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, fontSize: 12 }}>
              <div><span style={{ color: "#999" }}>File:</span> <b>{order.fileName}</b></div>
              <div><span style={{ color: "#999" }}>Pages:</span> <b>{order.pages} × {order.copies}c</b></div>
              <div><span style={{ color: "#999" }}>Type:</span> <b>{order.colorMode === "bw" ? "B&W" : "Color"} • {order.paperSize}</b></div>
              <div><span style={{ color: "#999" }}>Binding:</span> <b>{order.binding}</b></div>
            </div>
          </div>

          <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={lbl}>DELIVERY</div>
            <div style={{ fontSize: 12 }}>{addr.address}, {addr.city} - {addr.pincode}</div>
          </div>

          {order.notes && <div style={{ background: "#FFFAF0", borderRadius: 8, padding: 12, marginBottom: 8, border: "1px solid #FFE8C8" }}><div style={{ ...lbl, color: "#f59e0b" }}>NOTES</div><div style={{ fontSize: 12 }}>{order.notes}</div></div>}

          {(order.status === "ready" || order.status === "shipped" || order.status === "delivered") && (
            <div style={{ background: "#F0F9FF", borderRadius: 8, padding: 12, marginBottom: 8, border: "1px solid #BAE6FD" }}>
              <div style={{ ...lbl, color: "#0ea5e9" }}>TRACKING</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
                <select value={partner} onChange={e => setPartner(e.target.value)} style={{ ...inp, fontSize: 12 }}>
                  <option value="">Select partner...</option>
                  <option>Delhivery</option><option>Speed Post</option><option>DTDC</option><option>BlueDart</option><option>Self Delivery</option>
                </select>
                <input value={trackingId} onChange={e => setTrackingId(e.target.value)} placeholder="Tracking ID" style={{ ...inp, fontSize: 12 }} />
              </div>
              <button onClick={saveTracking} disabled={saving} style={{ marginTop: 6, padding: "5px 12px", borderRadius: 6, border: "none", background: "#0ea5e9", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{saving ? "..." : "Save Tracking"}</button>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <span style={{ fontSize: 12, padding: "5px 12px", borderRadius: 16, background: sc.bg, color: sc.color, fontWeight: 600 }}>Current: {sc.label}</span>
            {nextStatus && <button onClick={() => changeStatus(nextStatus)} disabled={saving} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: SC[nextStatus].color, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{saving ? "..." : `→ ${SC[nextStatus].label}`}</button>}
          </div>
        </>
      )}
    </Modal>
  );
}

function CustomerModal({ onClose }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.getCustomers().then(c => setCustomers(c)).catch(() => {}).finally(() => setLoading(false)); }, []);
  return (
    <Modal onClose={onClose} title={`Customers (${customers.length})`} wide>
      {loading ? <p style={{ color: "#999", textAlign: "center" }}>Loading...</p> :
        customers.map(c => (
          <div key={c._id} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #eee", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div><div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div><div style={{ fontSize: 11, color: "#888" }}>📱 {c.phone} {c.email ? `• ✉️ ${c.email}` : ""}</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 15, fontWeight: 700, color: "#FF6B35" }}>₹{(c.totalSpent || 0).toLocaleString("en-IN")}</div><div style={{ fontSize: 10, color: "#999" }}>{c.orderCount} order{c.orderCount !== 1 ? "s" : ""}</div></div>
          </div>
        ))}
    </Modal>
  );
}

function AddOrderModal({ onClose, onRefresh }) {
  const [o, setO] = useState({ customer: "", phone: "", file: "walk-in.pdf", pages: 1, copies: 1, colorMode: "bw", paperSize: "A4", sided: "single", binding: "No Binding", address: "Walk-in pickup", price: 0, payment: "cash", notes: "" });
  const [saving, setSaving] = useState(false);
  const ppp = o.colorMode === "bw" ? 2 : 8;
  const autoPrice = Math.ceil(ppp * (o.sided === "double" ? 0.7 : 1) * o.pages * o.copies);

  const submit = async () => {
    if (!o.customer || !o.phone) return;
    setSaving(true);
    try {
      await api.addManualOrder({ ...o, price: o.price || autoPrice });
      onRefresh();
      onClose();
    } catch (e) { alert(e.message); }
    setSaving(false);
  };

  return (
    <Modal onClose={onClose} title="Add Walk-in Order">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div><label style={lbl}>NAME *</label><input value={o.customer} onChange={e => setO({ ...o, customer: e.target.value })} style={inp} placeholder="Customer name" /></div>
        <div><label style={lbl}>PHONE *</label><input value={o.phone} onChange={e => setO({ ...o, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} style={inp} placeholder="9876543210" /></div>
        <div><label style={lbl}>FILE</label><input value={o.file} onChange={e => setO({ ...o, file: e.target.value })} style={inp} /></div>
        <div><label style={lbl}>PAGES</label><input type="number" min="1" value={o.pages} onChange={e => setO({ ...o, pages: Math.max(1, +e.target.value) })} style={inp} /></div>
        <div><label style={lbl}>COPIES</label><input type="number" min="1" value={o.copies} onChange={e => setO({ ...o, copies: Math.max(1, +e.target.value) })} style={inp} /></div>
        <div><label style={lbl}>TYPE</label><select value={o.colorMode} onChange={e => setO({ ...o, colorMode: e.target.value })} style={inp}><option value="bw">B&W ₹2/pg</option><option value="color">Color ₹8/pg</option></select></div>
        <div><label style={lbl}>PAYMENT</label><select value={o.payment} onChange={e => setO({ ...o, payment: e.target.value })} style={inp}><option value="cash">Cash</option><option value="upi">UPI</option></select></div>
        <div><label style={lbl}>PRICE ₹ <span style={{ color: "#bbb" }}>Auto: ₹{autoPrice}</span></label><input type="number" value={o.price || ""} onChange={e => setO({ ...o, price: +e.target.value })} style={inp} placeholder={`${autoPrice}`} /></div>
        <div style={{ gridColumn: "1/-1" }}><label style={lbl}>ADDRESS</label><input value={o.address} onChange={e => setO({ ...o, address: e.target.value })} style={inp} /></div>
      </div>
      <button onClick={submit} disabled={!o.customer || !o.phone || saving} style={{ marginTop: 14, width: "100%", padding: 12, borderRadius: 10, border: "none", background: (o.customer && o.phone) ? "linear-gradient(135deg,#FF6B35,#FF8C42)" : "#ddd", color: (o.customer && o.phone) ? "#fff" : "#999", fontSize: 14, fontWeight: 700, cursor: (o.customer && o.phone && !saving) ? "pointer" : "not-allowed" }}>{saving ? "Adding..." : `Add Order — ₹${o.price || autoPrice}`}</button>
    </Modal>
  );
}

function OrderRow({ order, onView }) {
  const sc = SC[order.status] || SC.pending;
  const addr = order.deliveryAddress || {};
  const user = order.user || {};
  return (
    <div onClick={() => onView(order)} style={{ background: "#fff", borderRadius: 10, padding: "12px 16px", border: "1px solid #eee", marginBottom: 6, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#FF6B35", fontFamily: "monospace" }}>{order.orderId}</span>
          <span style={{ fontSize: 10, color: "#bbb" }}>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{addr.name || user.name || "Customer"}</div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{order.fileName} • {order.pages}p×{order.copies}c • {order.colorMode === "bw" ? "B&W" : "Color"} • {order.binding}</div>
        {order.notes && <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 2 }}>📝 {order.notes}</div>}
        {order.trackingId && <div style={{ fontSize: 10, color: "#0ea5e9", marginTop: 1 }}>📦 {order.deliveryPartner}: {order.trackingId}</div>}
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a2e" }}>₹{order.totalPrice}</div>
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 12, background: sc.bg, color: sc.color, fontWeight: 600 }}>{sc.label}</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewOrder, setViewOrder] = useState(null);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);
  const [tab, setTab] = useState("orders");
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [passError, setPassError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersData, statsData] = await Promise.all([
        api.getAdminOrders({ status: filter === "all" ? "" : filter, search }),
        api.getAdminStats()
      ]);
      setOrders(ordersData.orders || []);
      setStats(statsData);
    } catch (e) { console.error("Fetch error:", e); }
    setLoading(false);
  };

  useEffect(() => { if (adminAuth) fetchData(); }, [adminAuth, filter]);

  const handleLogin = async () => {
    try {
      await api.adminLogin(adminPass);
      setAdminAuth(true);
      setPassError("");
    } catch (e) { setPassError(e.message || "Wrong password"); }
  };

  const doSearch = () => fetchData();

  if (!adminAuth) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#1a1a2e,#16213e)", fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 360, background: "#fff", borderRadius: 18, padding: "32px 24px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: "linear-gradient(135deg,#FF6B35,#FF8C42)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 12 }}>P</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Admin Dashboard</h2>
            <p style={{ fontSize: 12, color: "#999", marginTop: 3 }}>PrintKaaro Management</p>
          </div>
          <label style={lbl}>ADMIN PASSWORD</label>
          <input value={adminPass} onChange={e => setAdminPass(e.target.value)} type="password" placeholder="Enter password" onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ ...inp, marginBottom: 10 }} />
          {passError && <p style={{ color: "#e53e3e", fontSize: 11, marginBottom: 8, textAlign: "center" }}>{passError}</p>}
          <button onClick={handleLogin} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F7", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ background: "#1a1a2e", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg,#FF6B35,#FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>P</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>PrintKaaro</span>
          <span style={{ fontSize: 10, color: "#888", padding: "2px 6px", background: "rgba(255,255,255,.06)", borderRadius: 4 }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={fetchData} style={{ fontSize: 11, color: "#888", border: "1px solid #333", background: "none", padding: "4px 10px", borderRadius: 5, cursor: "pointer" }}>🔄 Refresh</button>
          <a href="/" style={{ fontSize: 11, color: "#888", textDecoration: "none" }}>← Store</a>
          <button onClick={() => setAdminAuth(false)} style={{ fontSize: 10, color: "#ef4444", border: "1px solid #ef444430", background: "none", padding: "4px 10px", borderRadius: 5, cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      <div style={{ background: "#fff", borderBottom: "1px solid #eee", display: "flex", padding: "0 20px" }}>
        {[{ key: "orders", label: "📦 Orders" }, { key: "analytics", label: "📊 Analytics" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", borderBottom: `2px solid ${tab === t.key ? "#FF6B35" : "transparent"}`, color: tab === t.key ? "#FF6B35" : "#888", background: "none" }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 16px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <StatCard icon="📦" label="TOTAL" value={stats.totalOrders || 0} color="#3b82f6" />
          <StatCard icon="📋" label="TODAY" value={stats.todayOrders || 0} color="#8b5cf6" />
          <StatCard icon="⏳" label="PENDING" value={stats.pendingOrders || 0} color="#f59e0b" />
          <StatCard icon="👥" label="CUSTOMERS" value={stats.totalCustomers || 0} color="#0ea5e9" onClick={() => setShowCustomers(true)} />
          <StatCard icon="💰" label="REVENUE" value={`₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`} color="#22c55e" />
        </div>

        {tab === "analytics" && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <RevenueChart stats={stats} />
            <StatusBreakdown stats={stats} />
          </div>
        )}

        {tab === "orders" && (<>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {[{ key: "all", label: "All" }, ...STATUS_FLOW.map(s => ({ key: s, label: SC[s].label })), { key: "cancelled", label: "Cancelled" }].map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${filter === f.key ? "#FF6B35" : "#e0e0e0"}`, background: filter === f.key ? "#FFF3ED" : "#fff", color: filter === f.key ? "#FF6B35" : "#888" }}>{f.label}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && doSearch()} placeholder="Search..." style={{ padding: "6px 10px", borderRadius: 6, border: "1.5px solid #e0e0e0", fontSize: 11, width: 150, outline: "none" }} />
              <button onClick={doSearch} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", fontSize: 11, cursor: "pointer" }}>🔍</button>
              <button onClick={() => setShowAddOrder(true)} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>+ Add</button>
            </div>
          </div>

          {loading ? <p style={{ textAlign: "center", color: "#999", padding: 30 }}>Loading orders...</p> :
            orders.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: "#ccc" }}><div style={{ fontSize: 36, marginBottom: 8 }}>📭</div><p style={{ fontSize: 13 }}>No orders found</p></div> :
              orders.map(o => <OrderRow key={o._id} order={o} onView={setViewOrder} />)}
        </>)}
      </div>

      {viewOrder && <OrderDetail order={viewOrder} onClose={() => setViewOrder(null)} onRefresh={fetchData} />}
      {showAddOrder && <AddOrderModal onClose={() => setShowAddOrder(false)} onRefresh={fetchData} />}
      {showCustomers && <CustomerModal onClose={() => setShowCustomers(false)} />}
    </div>
  );
}
