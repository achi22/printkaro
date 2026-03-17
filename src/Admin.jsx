import { useState, useEffect, useRef } from "react";
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
  // Parse per-file details from notes (stored as JSON array)
  let fileDetails = [];
  try { fileDetails = JSON.parse(order.notes || "[]"); } catch (e) {}
  
  const calcFilePrice = (f) => {
    const ppp = f.colorMode === "bw" ? 0.75 : 2;
    const sm = f.sided === "double" ? 0.7 : 1;
    const bindPrice = {"No Binding":0,"Spiral":25,"Staple":10,"Perfect Bind":60,"Hardcover":150}[f.binding] || 0;
    return Math.ceil(ppp * sm * (f.pages || 1) * (f.copies || 1) + bindPrice * (f.copies || 1));
  };

  let fileRows = "";
  if (fileDetails.length > 0) {
    fileRows = fileDetails.map((f, i) => {
      const price = calcFilePrice(f);
      return `
        <div style="background:#f9f9f9;border-radius:6px;padding:10px;margin:6px 0;">
          <div class="row"><strong>📄 File ${i + 1}:</strong><span>${f.name}</span></div>
          <div class="row"><span style="color:#888">Pages × Copies:</span><span>${f.pages} × ${f.copies}</span></div>
          <div class="row"><span style="color:#888">Print:</span><span>${f.colorMode === "bw" ? "B&W ₹0.75/pg" : "Color ₹2/pg"} | ${f.paperSize} | ${f.sided === "double" ? "Both Sides" : "Single Side"}</span></div>
          <div class="row"><span style="color:#888">Binding:</span><span>${f.binding}</span></div>
          <div class="row" style="margin-top:4px;padding-top:4px;border-top:1px dotted #ddd"><strong>File ${i + 1} Cost:</strong><strong style="color:#FF6B35">₹${price}</strong></div>
        </div>`;
    }).join("");
  } else {
    // Single file / old order format
    fileRows = `
      <div style="background:#f9f9f9;border-radius:6px;padding:10px;margin:6px 0;">
        <div class="row"><strong>📄 File:</strong><span>${order.fileName}</span></div>
        <div class="row"><span style="color:#888">Pages × Copies:</span><span>${order.pages} × ${order.copies}</span></div>
        <div class="row"><span style="color:#888">Print:</span><span>${order.colorMode === "bw" ? "B&W ₹0.75/pg" : "Color ₹2/pg"} | ${order.paperSize} | ${order.sided === "double" ? "Both Sides" : "Single Side"}</span></div>
        <div class="row"><span style="color:#888">Binding:</span><span>${order.binding}</span></div>
        <div class="row" style="margin-top:4px;padding-top:4px;border-top:1px dotted #ddd"><strong>Cost:</strong><strong style="color:#FF6B35">₹${order.price}</strong></div>
      </div>`;
  }

  const w = window.open("", "_blank", "width=420,height=700");
  w.document.write(`<!DOCTYPE html><html><head><title>Invoice ${order.orderId}</title>
<style>
body{font-family:Arial,sans-serif;padding:20px;max-width:380px;margin:0 auto;font-size:12px;color:#333}
h2{text-align:center;color:#FF6B35;margin:0 0 2px;font-size:20px}
.sub{text-align:center;color:#999;font-size:10px;margin:0 0 14px}
.line{border-top:1.5px dashed #ddd;margin:10px 0}
.row{display:flex;justify-content:space-between;margin:3px 0;font-size:12px}
.total{font-size:18px;font-weight:800;color:#FF6B35}
.section-title{font-size:11px;font-weight:700;color:#888;margin:10px 0 4px;text-transform:uppercase}
.footer{text-align:center;color:#bbb;font-size:10px;margin-top:16px}
</style></head><body>
<h2>🖨️ PrintKaaro</h2>
<p class="sub">printkaaro.in | +91 XXXXXXXXXX</p>
<div class="line"></div>

<div class="section-title">Order Info</div>
<div class="row"><span>Order ID:</span><strong style="color:#FF6B35">${order.orderId}</strong></div>
<div class="row"><span>Date:</span><span>${new Date(order.createdAt).toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric"})}</span></div>
<div class="row"><span>Status:</span><span>${order.status}</span></div>
<div class="line"></div>

<div class="section-title">Customer</div>
<div class="row"><span>Name:</span><span>${addr.name || "N/A"}</span></div>
<div class="row"><span>Phone:</span><span>${addr.phone || "N/A"}</span></div>
<div class="row"><span>Address:</span><span style="text-align:right;max-width:200px">${addr.address || ""}, ${addr.city || ""} - ${addr.pincode || ""}</span></div>
<div class="line"></div>

<div class="section-title">Files & Print Details (${fileDetails.length || 1} file${fileDetails.length > 1 ? "s" : ""})</div>
${fileRows}
<div class="line"></div>

<div class="section-title">Billing</div>
<div class="row"><span>Subtotal (${fileDetails.length || 1} file${fileDetails.length > 1 ? "s" : ""}):</span><span>₹${order.price}</span></div>
<div class="row"><span>Delivery:</span><span style="color:${order.deliveryCharge === 0 ? "#16a34a" : "#333"}">${order.deliveryCharge === 0 ? "FREE" : "₹" + order.deliveryCharge}</span></div>
<div class="line"></div>
<div class="row"><span class="total">Total:</span><span class="total">₹${order.totalPrice}</span></div>
<div class="row"><span>Payment:</span><span>${order.paymentMethod === "cash" ? "Cash on Delivery" : order.paymentMethod} | ${order.paymentStatus}</span></div>
<div class="line"></div>

<div class="footer">
<p>Thank you for choosing PrintKaaro! 🧡</p>
<p style="font-size:9px">printkaaro.in | WhatsApp: +91 XXXXXXXXXX</p>
</div>
<script>window.onload=()=>window.print()</script>
</body></html>`);
  w.document.close();
}

function ShiprocketPanel({ order, onRefresh, saving, setSaving }) {
  const [step, setStep] = useState(order.shiprocketAWB ? "done" : order.shiprocketShipmentId ? "couriers" : "start");
  const [couriers, setCouriers] = useState([]);
  const [shipmentId, setShipmentId] = useState(order.shiprocketShipmentId || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [tracking, setTracking] = useState(null);

  // Step 1: Create shipment on Shiprocket
  const createShipment = async () => {
    setLoading(true); setError("");
    try {
      const res = await api.srCreateShipment(order.orderId || order._id);
      setShipmentId(res.shipmentId);
      // Use couriers returned from server if available
      if (res.couriers && res.couriers.length > 0) {
        setCouriers(res.couriers);
      }
      setStep("couriers");
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  // Step 1b: Load couriers if shipment already exists
  const loadCouriers = async () => {
    setLoading(true); setError("");
    try {
      const cr = await api.srGetCouriers(shipmentId);
      setCouriers(cr.couriers || []);
      setStep("couriers");
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  // Step 2: Assign courier
  const assignCourier = async (courierId) => {
    setLoading(true); setError("");
    try {
      const res = await api.srAssignCourier(shipmentId, courierId, order.orderId || order._id);
      setResult(res);
      setStep("done");
      onRefresh();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  // Track
  const loadTracking = async () => {
    setLoading(true);
    try {
      const t = await api.srTrack(order.orderId || order._id);
      setTracking(t);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  // Cancel
  const cancelShipment = async () => {
    if (!confirm("Cancel this Shiprocket shipment?")) return;
    setLoading(true);
    try {
      await api.srCancel(order.orderId || order._id);
      setStep("start"); setShipmentId(""); setResult(null);
      onRefresh();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ background: "#F0F9FF", borderRadius: 8, padding: 14, marginBottom: 8, border: "1px solid #BAE6FD" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ ...lbl, color: "#0ea5e9", margin: 0 }}>🚚 SHIPROCKET SHIPPING</div>
        {order.shiprocketAWB && <a href={`https://shiprocket.co/tracking/${order.shiprocketAWB}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#0ea5e9", textDecoration: "none", fontWeight: 600 }}>Track →</a>}
      </div>

      {error && <div style={{ background: "#FEF2F2", borderRadius: 6, padding: 8, marginBottom: 8, fontSize: 11, color: "#ef4444" }}>❌ {error} <button onClick={() => setError("")} style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer", fontWeight: 700 }}>×</button></div>}

      {/* Step: Start — Create Shipment */}
      {step === "start" && !loading && (
        <div>
          <p style={{ fontSize: 12, color: "#666", margin: "0 0 8px" }}>Create a shipment on Shiprocket to get courier options and pricing.</p>
          <button onClick={createShipment} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#0ea5e9,#0284c7)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>📦 Create Shipment</button>
        </div>
      )}

      {/* Step: Couriers — Pick courier */}
      {step === "couriers" && !loading && (
        <div>
          {couriers.length === 0 ? (
            <div>
              <p style={{ fontSize: 12, color: "#666", margin: "0 0 8px" }}>Shipment created! Fetch available couriers:</p>
              <button onClick={loadCouriers} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: "#0ea5e9", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Load Couriers</button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#333", margin: "0 0 6px" }}>Select a courier ({couriers.length} available):</p>
              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                {couriers.map(c => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 6, border: "1px solid #e0e0e0", background: "#fff", marginBottom: 4 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: "#888" }}>ETA: {c.etd} • Rating: {c.rating}/5</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#FF6B35" }}>₹{c.rate}</span>
                      <button onClick={() => assignCourier(c.id)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#22c55e", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Ship</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step: Done — Shipped */}
      {step === "done" && !loading && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <div style={{ background: "#fff", borderRadius: 6, padding: 8 }}>
              <div style={{ fontSize: 10, color: "#888" }}>AWB / TRACKING</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0ea5e9" }}>{order.shiprocketAWB || result?.awb || "Pending"}</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 6, padding: 8 }}>
              <div style={{ fontSize: 10, color: "#888" }}>COURIER</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{order.deliveryPartner || result?.courierName || "Assigned"}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {(order.shiprocketLabelUrl || result?.labelUrl) && <a href={order.shiprocketLabelUrl || result?.labelUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #0ea5e9", background: "#fff", color: "#0ea5e9", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>🏷️ Label</a>}
            {(order.shiprocketAWB || result?.awb) && <a href={`https://shiprocket.co/tracking/${order.shiprocketAWB || result?.awb}`} target="_blank" rel="noopener noreferrer" style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #22c55e", background: "#fff", color: "#22c55e", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>📍 Track</a>}
            <button onClick={loadTracking} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #666", background: "#fff", color: "#666", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>🔄 Status</button>
            <button onClick={cancelShipment} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #ef4444", background: "#fff", color: "#ef4444", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Cancel Ship</button>
          </div>
          {tracking && (
            <div style={{ marginTop: 8, background: "#fff", borderRadius: 6, padding: 8, fontSize: 11 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Latest Status:</div>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "#555", fontSize: 10 }}>{JSON.stringify(tracking.tracking, null, 2).slice(0, 500)}</pre>
            </div>
          )}
        </div>
      )}

      {loading && <div style={{ textAlign: "center", padding: 12 }}><div style={{ display: "inline-block", width: 20, height: 20, borderRadius: "50%", border: "3px solid #0ea5e920", borderTopColor: "#0ea5e9", animation: "spin 1s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><p style={{ fontSize: 11, color: "#888", margin: "6px 0 0" }}>Working...</p></div>}
    </div>
  );
}

function OrderDetail({ order, onClose, onUpdate, onCancel, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [ed, setEd] = useState({});
  const [showCancel, setShowCancel] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
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
  const deleteOrder = async () => { setSaving(true); try { await api.deleteOrder(order._id); onRefresh(); onClose(); } catch (e) { alert(e.message); } setSaving(false); };

  return (
    <Modal onClose={onClose} title={`Order ${order.orderId}`} wide>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {order.filePath && order.filePath.split(",").filter(Boolean).map((fid, i) => 
          <a key={i} href={`${api.API_URL}/api/orders/file/${fid}?adminpass=${localStorage.getItem("pk_admin")}`} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #3b82f6", background: "#EFF6FF", color: "#3b82f6", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>📄 File {order.filePath.includes(",") ? (i+1) : ""}</a>
        )}
        {(!order.filePath || order.filePath.trim() === "") && <span style={{ padding: "6px 12px", borderRadius: 6, background: "#FEF2F2", color: "#ef4444", fontSize: 11, fontWeight: 600 }}>⚠️ No files uploaded — customer needs to re-order</span>}
        <button onClick={() => printInvoice(order)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>🧾 Invoice</button>
        <button onClick={() => setEditing(!editing)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ddd", background: editing ? "#FFF3ED" : "#fff", color: editing ? "#FF6B35" : "#333", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>✏️ {editing ? "Cancel" : "Edit"}</button>
        <a href={`https://wa.me/91${addr.phone || user.phone}?text=Hi ${addr.name || user.name}, your PrintKaaro order ${order.orderId} update:`} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 12px", borderRadius: 6, background: "#25D366", color: "#fff", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>💬 WhatsApp</a>
        {order.status !== "cancelled" && order.status !== "delivered" && <button onClick={() => setShowCancel(true)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ef4444", background: "#fff", color: "#ef4444", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Cancel</button>}
        <button onClick={() => setShowDelete(true)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #888", background: "#fff", color: "#888", fontSize: 11, fontWeight: 600, cursor: "pointer", marginLeft: "auto" }}>🗑️ Delete</button>
      </div>

      {showCancel && <div style={{ background: "#FEF2F2", borderRadius: 8, padding: 14, marginBottom: 12, border: "1px solid #FECACA" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#ef4444", margin: "0 0 8px" }}>Cancel this order?</p>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={cancelOrder} disabled={saving} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: "#ef4444", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Yes, Cancel</button>
          <button onClick={() => setShowCancel(false)} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>No</button>
        </div>
      </div>}

      {showDelete && <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 14, marginBottom: 12, border: "1px solid #333" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#ef4444", margin: "0 0 4px" }}>Permanently delete this order?</p>
        <p style={{ fontSize: 11, color: "#999", margin: "0 0 10px" }}>This will remove the order and its PDF files forever. This cannot be undone.</p>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={deleteOrder} disabled={saving} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: "#ef4444", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{saving ? "Deleting..." : "Yes, Delete Forever"}</button>
          <button onClick={() => setShowDelete(false)} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #555", background: "none", color: "#999", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>No, Keep</button>
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
            <ShiprocketPanel order={order} onRefresh={onRefresh} saving={saving} setSaving={setSaving} />
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
  const ppp = o.colorMode === "bw" ? 0.75 : 2;
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
        <div><label style={lbl}>TYPE</label><select value={o.colorMode} onChange={e => setO({ ...o, colorMode: e.target.value })} style={inp}><option value="bw">B&W ₹0.75/pg</option><option value="color">Color ₹2/pg</option></select></div>
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

  const [notifPerm, setNotifPerm] = useState("Notification" in window ? Notification.permission : "denied");
  const prevCountRef = useRef(0);

  const requestNotif = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(p => setNotifPerm(p));
    }
  };

  const fetchData = async (silent) => {
    if (!silent) setLoading(true);
    try {
      const [ordersData, statsData] = await Promise.all([
        api.getAdminOrders({ status: filter === "all" ? "" : filter, search }),
        api.getAdminStats()
      ]);
      // Fetch visit stats
      let visitStats = {};
      try { const vr = await fetch(api.API_URL + "/api/visits"); visitStats = await vr.json(); } catch(e) {}
      const newOrders = ordersData.orders || [];
      const newTotal = statsData.totalOrders || 0;
      
      // Check for new orders — only if we already loaded once AND count increased
      if (silent && prevCountRef.current > 0 && newTotal > prevCountRef.current) {
        const latest = newOrders[0];
        const addr = latest?.deliveryAddress || {};
        
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("New PrintKaaro Order!", {
            body: `${addr.name || "Customer"} ordered ${latest?.fileName || "document"} — ₹${latest?.totalPrice || 0}`,
            tag: "pk-order-" + newTotal,
          });
        }
        
        document.title = `(NEW) PrintKaaro Admin`;
        setTimeout(() => { document.title = "PrintKaaro Admin"; }, 15000);
      }
      
      prevCountRef.current = newTotal;
      setOrders(newOrders);
      setStats({...statsData, ...visitStats});
    } catch (e) { console.error("Fetch error:", e); }
    if (!silent) setLoading(false);
  };

  // Auto-refresh every 20 seconds
  const initialLoadDone = useRef(false);
  
  useEffect(() => { 
    if (adminAuth) {
      fetchData();
      initialLoadDone.current = false;
      // Mark initial load done after first fetch
      setTimeout(() => { initialLoadDone.current = true; }, 3000);
      const interval = setInterval(() => {
        if (initialLoadDone.current) fetchData(true);
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [adminAuth, filter]);

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
          {notifPerm !== "granted" && <button onClick={requestNotif} style={{ fontSize: 11, color: "#22c55e", border: "1px solid #22c55e30", background: "none", padding: "4px 10px", borderRadius: 5, cursor: "pointer" }}>🔔 Enable Alerts</button>}
          {notifPerm === "granted" && <span style={{ fontSize: 10, color: "#22c55e", padding: "4px 8px" }}>🔔 Live</span>}
          <button onClick={async()=>{if(confirm("Delete all delivered/cancelled orders older than 7 days?")){try{const r=await api.cleanupOldOrders();alert(r.message);fetchData();}catch(e){alert(e.message);}}}} style={{ fontSize: 11, color: "#f59e0b", border: "1px solid #f59e0b30", background: "none", padding: "4px 10px", borderRadius: 5, cursor: "pointer" }}>🧹 Cleanup</button>
          <a href="/" style={{ fontSize: 11, color: "#888", textDecoration: "none" }}>← Store</a>
          <button onClick={() => setAdminAuth(false)} style={{ fontSize: 10, color: "#ef4444", border: "1px solid #ef444430", background: "none", padding: "4px 10px", borderRadius: 5, cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      <div style={{ background: "#fff", borderBottom: "1px solid #eee", display: "flex", padding: "0 20px" }}>
        {[{ key: "orders", label: "📦 Orders" }, { key: "analytics", label: "📊 Analytics" }, { key: "traffic", label: "🌐 Traffic" }].map(t => (
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
          <StatCard icon="👁️" label="TODAY" value={`${stats.todayUnique || 0} people`} sub={`${stats.todayVisits || 0} page views`} color="#ec4899" />
          <StatCard icon="🌐" label="ALL TIME" value={`${stats.totalUnique || 0} people`} sub={`${stats.totalVisits || 0} page views`} color="#6366f1" />
        </div>

        {tab === "analytics" && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <RevenueChart stats={stats} />
            <StatusBreakdown stats={stats} />
          </div>
        )}

        {tab === "traffic" && (
          <div>
            {/* Visitor Chart */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #eee", marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>Visitors (Last 7 Days)</h3>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                {(stats.daily || []).length === 0 ? <p style={{ color: "#ccc", fontSize: 12, margin: "auto" }}>No data yet — visits will show after people visit your site</p> :
                  (stats.daily || []).reverse().map(d => {
                    const maxV = Math.max(...(stats.daily || []).map(x => x.visits), 1);
                    const h = Math.max((d.visits / maxV) * 100, 6);
                    return (
                      <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#6366f1" }}>{d.visits}</span>
                        <div style={{ width: "100%", height: h, borderRadius: "4px 4px 2px 2px", background: "linear-gradient(180deg, #6366f1, #8b5cf6)" }} />
                        <span style={{ fontSize: 9, color: "#999" }}>{d.date?.slice(5)}</span>
                        <span style={{ fontSize: 8, color: "#bbb" }}>{d.unique}u</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #eee", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Website Traffic</h3>
                <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>Open Full Analytics →</a>
              </div>
              <p style={{ fontSize: 13, color: "#888", margin: "0 0 14px" }}>Real-time data from Google Analytics (G-1CM96Q0MEV)</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                <div style={{ background: "#F0F9FF", borderRadius: 10, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#0ea5e9", fontWeight: 600, marginBottom: 4 }}>VIEW REPORTS</div>
                  <a href="https://analytics.google.com/analytics/web/#/report-home/a000000000w000000000p000000000" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#333", textDecoration: "none", fontWeight: 600 }}>📊 Dashboard</a>
                </div>
                <div style={{ background: "#FFF3ED", borderRadius: 10, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#FF6B35", fontWeight: 600, marginBottom: 4 }}>REAL-TIME</div>
                  <a href="https://analytics.google.com/analytics/web/#/realtime/overview" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#333", textDecoration: "none", fontWeight: 600 }}>⚡ Live Users</a>
                </div>
                <div style={{ background: "#F0FDF4", borderRadius: 10, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, marginBottom: 4 }}>AUDIENCE</div>
                  <a href="https://analytics.google.com/analytics/web/#/report/visitors-overview" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#333", textDecoration: "none", fontWeight: 600 }}>👥 Users</a>
                </div>
              </div>

              <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 16 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px" }}>Quick Stats Guide</h4>
                <div style={{ fontSize: 13, lineHeight: 2, color: "#555" }}>
                  <div>📈 <strong>Users</strong> — Total visitors to your site</div>
                  <div>👁️ <strong>Page Views</strong> — Total pages viewed</div>
                  <div>⏱️ <strong>Avg. Session</strong> — How long visitors stay</div>
                  <div>📱 <strong>Devices</strong> — Mobile vs Desktop split</div>
                  <div>📍 <strong>Locations</strong> — Where visitors come from</div>
                  <div>🔗 <strong>Sources</strong> — How they found you (Google, Facebook, Direct)</div>
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #eee", marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>Business Insights</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>CONVERSION RATE</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#FF6B35" }}>{stats.totalOrders && stats.totalCustomers ? ((stats.totalOrders / Math.max(stats.totalCustomers, 1)) * 100).toFixed(0) : 0}%</div>
                  <div style={{ fontSize: 11, color: "#999" }}>Orders per customer</div>
                </div>
                <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>AVG ORDER VALUE</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#22c55e" }}>₹{stats.totalOrders ? Math.round((stats.totalRevenue || 0) / stats.totalOrders) : 0}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>Per order average</div>
                </div>
                <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>PENDING RATE</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#f59e0b" }}>{stats.totalOrders ? Math.round(((stats.pendingOrders || 0) / stats.totalOrders) * 100) : 0}%</div>
                  <div style={{ fontSize: 11, color: "#999" }}>Orders need action</div>
                </div>
                <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>TODAY'S REVENUE</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#3b82f6" }}>₹{((stats.dailyRevenue || []).find(d => d._id === new Date().toISOString().slice(0, 10))?.revenue || 0).toLocaleString("en-IN")}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>Earned today</div>
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #eee" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px" }}>Google Search Console</h3>
              <p style={{ fontSize: 13, color: "#888", margin: "0 0 10px" }}>Check how your site performs on Google Search</p>
              <a href="https://search.google.com/search-console?resource_id=https://printkaaro.in" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "10px 20px", borderRadius: 8, background: "#4285F4", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Open Search Console →</a>
            </div>
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
