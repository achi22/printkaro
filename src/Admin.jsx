import { useState } from "react";

// ─── SAMPLE DATA ───
const INITIAL_ORDERS = [
  { id: "PK-20260315-001", customer: "Rahul Sharma", phone: "9876543210", email: "rahul@gmail.com", file: "thesis_final.pdf", fileUrl: "#", pages: 60, copies: 2, colorMode: "color", paperSize: "A4", sided: "double", binding: "Spiral", address: "123 MG Road, Balurghat, WB 733101", price: 1010, payment: "upi", status: "confirmed", date: "2026-03-15T10:30:00", notes: "", trackingId: "", deliveryPartner: "" },
  { id: "PK-20260315-002", customer: "Priya Das", phone: "8765432109", email: "", file: "resume_2026.pdf", fileUrl: "#", pages: 4, copies: 10, colorMode: "color", paperSize: "A4", sided: "single", binding: "No Binding", address: "45 Station Road, Balurghat, WB 733101", price: 360, payment: "razorpay", status: "printing", date: "2026-03-15T09:15:00", notes: "Glossy paper if available", trackingId: "", deliveryPartner: "" },
  { id: "PK-20260314-003", customer: "Amit Roy", phone: "7654321098", email: "amit.roy@email.com", file: "project_report.pdf", fileUrl: "#", pages: 120, copies: 1, colorMode: "bw", paperSize: "A4", sided: "double", binding: "Perfect Bind", address: "78 College Para, Balurghat, WB 733101", price: 228, payment: "upi", status: "ready", date: "2026-03-14T16:45:00", notes: "", trackingId: "", deliveryPartner: "" },
  { id: "PK-20260314-004", customer: "Sneha Ghosh", phone: "6543210987", email: "sneha@gmail.com", file: "wedding_card.pdf", fileUrl: "#", pages: 8, copies: 100, colorMode: "color", paperSize: "A5", sided: "double", binding: "Staple", address: "12 Netaji Subhas Road, Balurghat, WB 733101", price: 5480, payment: "razorpay", status: "shipped", date: "2026-03-14T11:20:00", notes: "Need by March 18", trackingId: "DL9876543210", deliveryPartner: "Delhivery" },
  { id: "PK-20260313-005", customer: "Kunal Sen", phone: "9988776655", email: "", file: "study_notes_sem6.pdf", fileUrl: "#", pages: 200, copies: 1, colorMode: "bw", paperSize: "A4", sided: "single", binding: "Spiral", address: "56 Hospital Road, Balurghat, WB 733101", price: 465, payment: "upi", status: "delivered", date: "2026-03-13T14:00:00", notes: "", trackingId: "SP1234567890", deliveryPartner: "Speed Post" },
  { id: "PK-20260313-006", customer: "Diya Sarkar", phone: "8877665544", email: "diya.s@email.com", file: "children_book_draft.pdf", fileUrl: "#", pages: 40, copies: 5, colorMode: "color", paperSize: "A4", sided: "double", binding: "Hardcover", address: "90 Rabindra Sarani, Balurghat, WB 733101", price: 1870, payment: "razorpay", status: "delivered", date: "2026-03-13T08:30:00", notes: "Handle with care - gift", trackingId: "DL1122334455", deliveryPartner: "Delhivery" },
  { id: "PK-20260312-007", customer: "Rahul Sharma", phone: "9876543210", email: "rahul@gmail.com", file: "lab_manual.pdf", fileUrl: "#", pages: 80, copies: 1, colorMode: "bw", paperSize: "A4", sided: "double", binding: "Spiral", address: "123 MG Road, Balurghat, WB 733101", price: 137, payment: "upi", status: "delivered", date: "2026-03-12T12:00:00", notes: "", trackingId: "SP9988776655", deliveryPartner: "Speed Post" },
  { id: "PK-20260311-008", customer: "Priya Das", phone: "8765432109", email: "", file: "invitation.pdf", fileUrl: "#", pages: 2, copies: 50, colorMode: "color", paperSize: "A5", sided: "single", binding: "No Binding", address: "45 Station Road, Balurghat, WB 733101", price: 840, payment: "upi", status: "delivered", date: "2026-03-11T15:30:00", notes: "", trackingId: "DL5566778899", deliveryPartner: "Delhivery" },
];

const STATUS_FLOW = ["confirmed", "printing", "ready", "shipped", "delivered"];
const SC = {
  confirmed: { label: "Confirmed", color: "#8b5cf6", bg: "#8b5cf615" },
  printing: { label: "Printing", color: "#f59e0b", bg: "#f59e0b15" },
  ready: { label: "Ready", color: "#3b82f6", bg: "#3b82f615" },
  shipped: { label: "Shipped", color: "#0ea5e9", bg: "#0ea5e915" },
  delivered: { label: "Delivered", color: "#22c55e", bg: "#22c55e15" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "#ef444415" },
};

const inp = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" };
const lbl = { fontSize: 11, fontWeight: 600, color: "#999", display: "block", marginBottom: 4, letterSpacing: 0.5 };

// ─── MODAL WRAPPER ───
function Modal({ children, onClose, title, wide }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: 28, maxWidth: wide ? 700 : 520, width: "100%", maxHeight: "88vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ border: "none", background: "#f5f5f5", borderRadius: 8, width: 32, height: 32, fontSize: 16, cursor: "pointer", color: "#999" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── STAT CARD ───
function StatCard({ icon, label, value, sub, color, onClick }) {
  return (
    <div onClick={onClick} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #eee", flex: 1, minWidth: 140, cursor: onClick ? "pointer" : "default", transition: "box-shadow 0.2s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
        <span style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#1a1a2e" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ─── REVENUE CHART (Simple CSS bars) ───
function RevenueChart({ orders }) {
  const days = {};
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    days[key] = { label, revenue: 0, count: 0 };
    last7.push(key);
  }
  orders.filter(o => o.status !== "cancelled").forEach(o => {
    const key = o.date.slice(0, 10);
    if (days[key]) { days[key].revenue += o.price; days[key].count++; }
  });
  const maxRev = Math.max(...last7.map(k => days[k].revenue), 1);

  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Revenue (Last 7 Days)</h3>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#22c55e" }}>₹{last7.reduce((s, k) => s + days[k].revenue, 0).toLocaleString("en-IN")}</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
        {last7.map(k => {
          const d = days[k];
          const h = Math.max((d.revenue / maxRev) * 120, 4);
          return (
            <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#666" }}>{d.revenue > 0 ? `₹${d.revenue}` : ""}</span>
              <div style={{ width: "100%", height: h, borderRadius: "6px 6px 2px 2px", background: d.revenue > 0 ? "linear-gradient(180deg, #FF6B35, #FF8C42)" : "#f0f0f0", transition: "height 0.3s" }} />
              <span style={{ fontSize: 10, color: "#999" }}>{d.label}</span>
              {d.count > 0 && <span style={{ fontSize: 9, color: "#bbb" }}>{d.count} orders</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ORDER STATUS BREAKDOWN PIE (CSS) ───
function StatusBreakdown({ orders }) {
  const counts = {};
  STATUS_FLOW.concat(["cancelled"]).forEach(s => counts[s] = orders.filter(o => o.status === s).length);
  const total = orders.length || 1;
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", marginBottom: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", margin: "0 0 14px" }}>Order Status Breakdown</h3>
      {STATUS_FLOW.concat(["cancelled"]).map(s => {
        const c = counts[s];
        if (c === 0) return null;
        const pct = Math.round((c / total) * 100);
        return (
          <div key={s} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
              <span style={{ color: SC[s].color, fontWeight: 600 }}>{SC[s].label}</span>
              <span style={{ color: "#999" }}>{c} ({pct}%)</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "#f0f0f0", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: SC[s].color, transition: "width 0.3s" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── INVOICE GENERATOR ───
function printInvoice(order) {
  const w = window.open("", "_blank", "width=400,height=600");
  w.document.write(`<!DOCTYPE html><html><head><title>Invoice ${order.id}</title><style>
    body{font-family:Arial,sans-serif;padding:24px;max-width:380px;margin:0 auto;font-size:13px;color:#333}
    h2{text-align:center;color:#FF6B35;margin:0 0 4px}
    .sub{text-align:center;color:#999;font-size:11px;margin:0 0 20px}
    .line{border-top:1px dashed #ddd;margin:12px 0}
    .row{display:flex;justify-content:space-between;margin:4px 0}
    .total{font-size:18px;font-weight:800;color:#FF6B35}
    .footer{text-align:center;color:#bbb;font-size:10px;margin-top:20px}
    @media print{body{padding:12px}}
  </style></head><body>
    <h2>PrintKaaro</h2>
    <p class="sub">printkaaro.in | Invoice</p>
    <div class="line"></div>
    <div class="row"><span>Order ID:</span><strong>${order.id}</strong></div>
    <div class="row"><span>Date:</span><span>${new Date(order.date).toLocaleDateString("en-IN")}</span></div>
    <div class="row"><span>Customer:</span><span>${order.customer}</span></div>
    <div class="row"><span>Phone:</span><span>${order.phone}</span></div>
    <div class="line"></div>
    <div class="row"><span>File:</span><span>${order.file}</span></div>
    <div class="row"><span>Pages:</span><span>${order.pages} x ${order.copies} copies</span></div>
    <div class="row"><span>Type:</span><span>${order.colorMode === "bw" ? "B&W" : "Color"} | ${order.paperSize} | ${order.sided}-sided</span></div>
    <div class="row"><span>Binding:</span><span>${order.binding}</span></div>
    ${order.notes ? `<div class="row"><span>Notes:</span><span>${order.notes}</span></div>` : ""}
    <div class="line"></div>
    <div class="row"><span>Subtotal:</span><span>₹${order.price}</span></div>
    <div class="row"><span>Delivery:</span><span>${order.price >= 500 ? "FREE" : "₹40"}</span></div>
    <div class="line"></div>
    <div class="row"><span class="total">Total:</span><span class="total">₹${order.price + (order.price >= 500 ? 0 : 40)}</span></div>
    <div class="row"><span>Payment:</span><span>${order.payment === "upi" ? "UPI" : "Razorpay"} | Paid</span></div>
    <div class="line"></div>
    <div class="row"><span>Deliver to:</span></div>
    <p style="margin:4px 0;color:#666">${order.address}</p>
    <div class="footer"><p>Thank you for choosing PrintKaaro!</p><p>printkaaro.in</p></div>
    <script>window.onload=()=>window.print()</script>
  </body></html>`);
  w.document.close();
}

// ─── ORDER DETAIL + EDIT + DELIVERY TRACKING ───
function OrderDetail({ order, onClose, onUpdate, onCancel }) {
  const [editing, setEditing] = useState(false);
  const [ed, setEd] = useState({ ...order });
  const [showCancel, setShowCancel] = useState(false);
  const [trackingId, setTrackingId] = useState(order.trackingId || "");
  const [deliveryPartner, setDeliveryPartner] = useState(order.deliveryPartner || "");
  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];

  const saveEdit = () => { onUpdate(order.id, ed); setEditing(false); };
  const saveTracking = () => { onUpdate(order.id, { ...order, trackingId, deliveryPartner }); };

  if (!order) return null;
  const sc = SC[order.status] || SC.confirmed;

  return (
    <Modal onClose={onClose} title={`Order ${order.id}`} wide>
      {/* Action Buttons Row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => printInvoice(order)} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", color: "#333", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🧾 Print Invoice</button>
        <a href={order.fileUrl || "#"} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", color: "#333", fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>📄 View PDF</a>
        <button onClick={() => setEditing(!editing)} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e0e0e0", background: editing ? "#FFF3ED" : "#fff", color: editing ? "#FF6B35" : "#333", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✏️ {editing ? "Cancel Edit" : "Edit Order"}</button>
        <a href={`https://wa.me/91${order.phone}?text=Hi ${order.customer}, your PrintKaaro order ${order.id} update:`} target="_blank" rel="noopener noreferrer"
          style={{ padding: "8px 14px", borderRadius: 8, background: "#25D366", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>💬 WhatsApp</a>
        {order.status !== "cancelled" && order.status !== "delivered" && (
          <button onClick={() => setShowCancel(true)} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #ef4444", background: "#fff", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer", marginLeft: "auto" }}>Cancel Order</button>
        )}
      </div>

      {/* Cancel Confirmation */}
      {showCancel && (
        <div style={{ background: "#FEF2F2", borderRadius: 10, padding: 16, marginBottom: 16, border: "1px solid #FECACA" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#ef4444", margin: "0 0 8px" }}>Cancel this order and initiate refund?</p>
          <p style={{ fontSize: 12, color: "#999", margin: "0 0 12px" }}>₹{order.price} will be refunded to customer via {order.payment === "upi" ? "UPI" : "Razorpay"}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { onCancel(order.id); onClose(); }} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Yes, Cancel & Refund</button>
            <button onClick={() => setShowCancel(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", color: "#666", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>No, Keep Order</button>
          </div>
        </div>
      )}

      {editing ? (
        /* ─── EDIT MODE ─── */
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div><label style={lbl}>CUSTOMER</label><input value={ed.customer} onChange={e => setEd({ ...ed, customer: e.target.value })} style={inp} /></div>
          <div><label style={lbl}>PHONE</label><input value={ed.phone} onChange={e => setEd({ ...ed, phone: e.target.value })} style={inp} /></div>
          <div><label style={lbl}>PAGES</label><input type="number" value={ed.pages} onChange={e => setEd({ ...ed, pages: +e.target.value })} style={inp} /></div>
          <div><label style={lbl}>COPIES</label><input type="number" value={ed.copies} onChange={e => setEd({ ...ed, copies: +e.target.value })} style={inp} /></div>
          <div><label style={lbl}>COLOR MODE</label>
            <select value={ed.colorMode} onChange={e => setEd({ ...ed, colorMode: e.target.value })} style={inp}>
              <option value="bw">B&W</option><option value="color">Color</option>
            </select>
          </div>
          <div><label style={lbl}>PAPER SIZE</label>
            <select value={ed.paperSize} onChange={e => setEd({ ...ed, paperSize: e.target.value })} style={inp}>
              <option>A4</option><option>A3</option><option>A5</option><option>Legal</option>
            </select>
          </div>
          <div><label style={lbl}>BINDING</label><input value={ed.binding} onChange={e => setEd({ ...ed, binding: e.target.value })} style={inp} /></div>
          <div><label style={lbl}>PRICE (₹)</label><input type="number" value={ed.price} onChange={e => setEd({ ...ed, price: +e.target.value })} style={inp} /></div>
          <div style={{ gridColumn: "1 / -1" }}><label style={lbl}>ADDRESS</label><textarea value={ed.address} onChange={e => setEd({ ...ed, address: e.target.value })} rows={2} style={{ ...inp, resize: "none" }} /></div>
          <div style={{ gridColumn: "1 / -1" }}><label style={lbl}>NOTES</label><input value={ed.notes} onChange={e => setEd({ ...ed, notes: e.target.value })} style={inp} /></div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button onClick={saveEdit} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #FF6B35, #FF8C42)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Save Changes</button>
          </div>
        </div>
      ) : (
        /* ─── VIEW MODE ─── */
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 14 }}>
              <div style={lbl}>CUSTOMER</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>{order.customer}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>📱 {order.phone}</div>
              {order.email && <div style={{ fontSize: 12, color: "#666" }}>✉️ {order.email}</div>}
            </div>
            <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 14 }}>
              <div style={lbl}>PAYMENT</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#FF6B35" }}>₹{order.price}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{order.payment === "upi" ? "📱 UPI" : "💳 Razorpay"} • {order.status === "cancelled" ? "Refunded" : "Paid"}</div>
            </div>
          </div>

          <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 14, marginBottom: 10 }}>
            <div style={lbl}>PRINT DETAILS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 13 }}>
              <div><span style={{ color: "#999" }}>File:</span> <span style={{ fontWeight: 500 }}>{order.file}</span></div>
              <div><span style={{ color: "#999" }}>Pages:</span> <span style={{ fontWeight: 500 }}>{order.pages} × {order.copies}c</span></div>
              <div><span style={{ color: "#999" }}>Type:</span> <span style={{ fontWeight: 500 }}>{order.colorMode === "bw" ? "B&W" : "Color"} • {order.paperSize}</span></div>
              <div><span style={{ color: "#999" }}>Binding:</span> <span style={{ fontWeight: 500 }}>{order.binding}</span></div>
            </div>
          </div>

          <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 14, marginBottom: 10 }}>
            <div style={lbl}>DELIVERY ADDRESS</div>
            <div style={{ fontSize: 13 }}>{order.address}</div>
          </div>

          {order.notes && (
            <div style={{ background: "#FFFAF0", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #FFE8C8" }}>
              <div style={{ ...lbl, color: "#f59e0b" }}>SPECIAL NOTES</div>
              <div style={{ fontSize: 13 }}>{order.notes}</div>
            </div>
          )}

          {/* Delivery Tracking */}
          {(order.status === "shipped" || order.status === "delivered" || order.status === "ready") && (
            <div style={{ background: "#F0F9FF", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #BAE6FD" }}>
              <div style={{ ...lbl, color: "#0ea5e9" }}>DELIVERY TRACKING</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 6 }}>
                <div>
                  <label style={{ ...lbl, fontSize: 10 }}>PARTNER</label>
                  <select value={deliveryPartner} onChange={e => setDeliveryPartner(e.target.value)} style={{ ...inp, fontSize: 13 }}>
                    <option value="">Select...</option>
                    <option>Delhivery</option><option>Speed Post</option><option>DTDC</option><option>BlueDart</option><option>Shiprocket</option><option>Self Delivery</option>
                  </select>
                </div>
                <div>
                  <label style={{ ...lbl, fontSize: 10 }}>TRACKING ID</label>
                  <input value={trackingId} onChange={e => setTrackingId(e.target.value)} placeholder="Enter tracking ID" style={{ ...inp, fontSize: 13 }} />
                </div>
              </div>
              <button onClick={saveTracking} style={{ marginTop: 8, padding: "6px 14px", borderRadius: 6, border: "none", background: "#0ea5e9", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save Tracking</button>
              {order.trackingId && <p style={{ fontSize: 12, color: "#0ea5e9", marginTop: 6 }}>📦 {order.deliveryPartner}: {order.trackingId}</p>}
            </div>
          )}

          {/* Status + Next Action */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
            <span style={{ fontSize: 13, padding: "6px 14px", borderRadius: 20, background: sc.bg, color: sc.color, fontWeight: 600 }}>Current: {sc.label}</span>
            {nextStatus && (
              <button onClick={() => { onUpdate(order.id, { ...order, status: nextStatus }); onClose(); }}
                style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: SC[nextStatus].color, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Move to → {SC[nextStatus].label}
              </button>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}

// ─── ADD MANUAL ORDER ───
function AddOrderModal({ onClose, onAdd }) {
  const [o, setO] = useState({ customer: "", phone: "", email: "", file: "walk-in-order.pdf", pages: 1, copies: 1, colorMode: "bw", paperSize: "A4", sided: "single", binding: "No Binding", address: "", price: 0, payment: "cash", notes: "" });

  const pricePerPage = o.colorMode === "bw" ? 2 : 8;
  const autoPrice = Math.ceil(pricePerPage * (o.sided === "double" ? 0.7 : 1) * o.pages * o.copies);

  const submit = () => {
    if (!o.customer || !o.phone) return;
    const id = `PK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`;
    onAdd({ ...o, id, price: o.price || autoPrice, status: "confirmed", date: new Date().toISOString(), fileUrl: "#", trackingId: "", deliveryPartner: "" });
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Add Walk-in Order">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div><label style={lbl}>CUSTOMER NAME *</label><input value={o.customer} onChange={e => setO({ ...o, customer: e.target.value })} style={inp} placeholder="Customer name" /></div>
        <div><label style={lbl}>PHONE *</label><input value={o.phone} onChange={e => setO({ ...o, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} style={inp} placeholder="9876543210" /></div>
        <div><label style={lbl}>EMAIL</label><input value={o.email} onChange={e => setO({ ...o, email: e.target.value })} style={inp} placeholder="Optional" /></div>
        <div><label style={lbl}>FILE NAME</label><input value={o.file} onChange={e => setO({ ...o, file: e.target.value })} style={inp} /></div>
        <div><label style={lbl}>PAGES</label><input type="number" min="1" value={o.pages} onChange={e => setO({ ...o, pages: Math.max(1, +e.target.value) })} style={inp} /></div>
        <div><label style={lbl}>COPIES</label><input type="number" min="1" value={o.copies} onChange={e => setO({ ...o, copies: Math.max(1, +e.target.value) })} style={inp} /></div>
        <div><label style={lbl}>TYPE</label>
          <select value={o.colorMode} onChange={e => setO({ ...o, colorMode: e.target.value })} style={inp}>
            <option value="bw">B&W (₹2/pg)</option><option value="color">Color (₹8/pg)</option>
          </select>
        </div>
        <div><label style={lbl}>PAPER SIZE</label>
          <select value={o.paperSize} onChange={e => setO({ ...o, paperSize: e.target.value })} style={inp}>
            <option>A4</option><option>A3</option><option>A5</option><option>Legal</option>
          </select>
        </div>
        <div><label style={lbl}>SIDES</label>
          <select value={o.sided} onChange={e => setO({ ...o, sided: e.target.value })} style={inp}>
            <option value="single">Single</option><option value="double">Double (-30%)</option>
          </select>
        </div>
        <div><label style={lbl}>BINDING</label>
          <select value={o.binding} onChange={e => setO({ ...o, binding: e.target.value })} style={inp}>
            <option>No Binding</option><option>Spiral</option><option>Staple</option><option>Perfect Bind</option><option>Hardcover</option>
          </select>
        </div>
        <div><label style={lbl}>PAYMENT</label>
          <select value={o.payment} onChange={e => setO({ ...o, payment: e.target.value })} style={inp}>
            <option value="cash">Cash</option><option value="upi">UPI</option><option value="razorpay">Razorpay</option>
          </select>
        </div>
        <div><label style={lbl}>PRICE (₹) <span style={{ color: "#bbb" }}>Auto: ₹{autoPrice}</span></label>
          <input type="number" value={o.price || ""} onChange={e => setO({ ...o, price: +e.target.value })} style={inp} placeholder={`${autoPrice}`} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}><label style={lbl}>ADDRESS</label><textarea value={o.address} onChange={e => setO({ ...o, address: e.target.value })} rows={2} style={{ ...inp, resize: "none" }} placeholder="Delivery address (or 'Walk-in pickup')" /></div>
        <div style={{ gridColumn: "1 / -1" }}><label style={lbl}>NOTES</label><input value={o.notes} onChange={e => setO({ ...o, notes: e.target.value })} style={inp} placeholder="Special instructions" /></div>
      </div>
      <button onClick={submit} disabled={!o.customer || !o.phone}
        style={{ marginTop: 16, width: "100%", padding: 14, borderRadius: 10, border: "none", background: (o.customer && o.phone) ? "linear-gradient(135deg, #FF6B35, #FF8C42)" : "#e0e0e0", color: (o.customer && o.phone) ? "#fff" : "#999", fontSize: 15, fontWeight: 700, cursor: (o.customer && o.phone) ? "pointer" : "not-allowed" }}>
        Add Order — ₹{o.price || autoPrice}
      </button>
    </Modal>
  );
}

// ─── CUSTOMER DATABASE ───
function CustomerModal({ orders, onClose }) {
  const customers = {};
  orders.forEach(o => {
    if (!customers[o.phone]) customers[o.phone] = { name: o.customer, phone: o.phone, email: o.email, orders: [], totalSpent: 0 };
    customers[o.phone].orders.push(o);
    customers[o.phone].totalSpent += o.status !== "cancelled" ? o.price : 0;
  });
  const list = Object.values(customers).sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <Modal onClose={onClose} title={`Customers (${list.length})`} wide>
      {list.map(c => (
        <div key={c.phone} style={{ padding: "14px 16px", borderRadius: 10, border: "1px solid #eee", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>{c.name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>📱 {c.phone} {c.email ? `• ✉️ ${c.email}` : ""}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#FF6B35" }}>₹{c.totalSpent.toLocaleString("en-IN")}</div>
            <div style={{ fontSize: 11, color: "#999" }}>{c.orders.length} order{c.orders.length > 1 ? "s" : ""}</div>
          </div>
        </div>
      ))}
    </Modal>
  );
}

// ─── ORDER ROW ───
function OrderRow({ order, onView }) {
  const sc = SC[order.status] || SC.confirmed;
  return (
    <div onClick={() => onView(order)} style={{ background: "#fff", borderRadius: 10, padding: "14px 18px", border: "1px solid #eee", marginBottom: 6, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "border-color 0.15s" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#FF6B35", fontFamily: "monospace" }}>{order.id}</span>
          <span style={{ fontSize: 11, color: "#ccc" }}>•</span>
          <span style={{ fontSize: 11, color: "#999" }}>{new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{order.customer}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>{order.file} • {order.pages}p×{order.copies}c • {order.colorMode === "bw" ? "B&W" : "Color"} • {order.binding}</div>
        {order.notes && <div style={{ fontSize: 11, color: "#f59e0b", marginTop: 3 }}>📝 {order.notes}</div>}
        {order.trackingId && <div style={{ fontSize: 11, color: "#0ea5e9", marginTop: 2 }}>📦 {order.deliveryPartner}: {order.trackingId}</div>}
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e" }}>₹{order.price}</div>
        <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: sc.bg, color: sc.color, fontWeight: 600 }}>{sc.label}</span>
      </div>
    </div>
  );
}

// ─── MAIN ADMIN ───
export default function AdminDashboard() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewOrder, setViewOrder] = useState(null);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);
  const [tab, setTab] = useState("orders");
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [passError, setPassError] = useState("");

  const handleLogin = () => {
    if (adminPass === "admin123") { setAdminAuth(true); setPassError(""); }
    else setPassError("Wrong password. Default: admin123");
  };

  const handleUpdate = (id, updated) => setOrders(orders.map(o => o.id === id ? { ...updated } : o));
  const handleCancel = (id) => setOrders(orders.map(o => o.id === id ? { ...o, status: "cancelled" } : o));
  const handleAdd = (newOrder) => setOrders([newOrder, ...orders]);

  const filtered = orders.filter(o => {
    const mf = filter === "all" || o.status === filter;
    const ms = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()) || o.phone.includes(search) || o.file.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.price, 0);
  const todayOrders = orders.filter(o => new Date(o.date).toDateString() === new Date().toDateString()).length;
  const pendingOrders = orders.filter(o => ["confirmed", "printing", "ready"].includes(o.status)).length;
  const uniqueCustomers = new Set(orders.map(o => o.phone)).size;

  // ─── Login ───
  if (!adminAuth) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 380, background: "#fff", borderRadius: 20, padding: 40, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg, #FF6B35, #FF8C42)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 14 }}>P</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Admin Dashboard</h2>
            <p style={{ fontSize: 13, color: "#999", marginTop: 4 }}>PrintKaaro Management Panel</p>
          </div>
          <label style={lbl}>ADMIN PASSWORD</label>
          <input value={adminPass} onChange={e => setAdminPass(e.target.value)} type="password" placeholder="Enter admin password" onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ ...inp, marginBottom: 12 }} />
          {passError && <p style={{ color: "#e53e3e", fontSize: 12, marginBottom: 12, textAlign: "center" }}>{passError}</p>}
          <button onClick={handleLogin} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #FF6B35, #FF8C42)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Login</button>
        </div>
      </div>
    );
  }

  // ─── Dashboard ───
  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F7", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top Bar */}
      <div style={{ background: "#1a1a2e", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #FF6B35, #FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>P</div>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>PrintKaaro</span>
          <span style={{ fontSize: 11, color: "#888", padding: "2px 8px", background: "rgba(255,255,255,0.06)", borderRadius: 4, marginLeft: 4 }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href="/" style={{ fontSize: 12, color: "#888", textDecoration: "none" }}>← Store</a>
          <button onClick={() => setAdminAuth(false)} style={{ fontSize: 11, color: "#ef4444", border: "1px solid #ef444430", background: "none", padding: "5px 12px", borderRadius: 6, cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", display: "flex", gap: 0, padding: "0 24px" }}>
        {[{ key: "orders", label: "📦 Orders" }, { key: "analytics", label: "📊 Analytics" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", borderBottom: `2px solid ${tab === t.key ? "#FF6B35" : "transparent"}`, color: tab === t.key ? "#FF6B35" : "#888", background: "none" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          <StatCard icon="📦" label="TOTAL ORDERS" value={orders.length} sub="All time" color="#3b82f6" />
          <StatCard icon="📋" label="TODAY" value={todayOrders} sub="New orders" color="#8b5cf6" />
          <StatCard icon="⏳" label="PENDING" value={pendingOrders} sub="Need action" color="#f59e0b" />
          <StatCard icon="👥" label="CUSTOMERS" value={uniqueCustomers} color="#0ea5e9" onClick={() => setShowCustomers(true)} />
          <StatCard icon="💰" label="REVENUE" value={`₹${totalRevenue.toLocaleString("en-IN")}`} sub="Total" color="#22c55e" />
        </div>

        {tab === "analytics" && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            <RevenueChart orders={orders} />
            <StatusBreakdown orders={orders} />
          </div>
        )}

        {tab === "orders" && (
          <>
            {/* Filters + Search + Add */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {[{ key: "all", label: "All" }, ...STATUS_FLOW.map(s => ({ key: s, label: SC[s].label })), { key: "cancelled", label: "Cancelled" }].map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)}
                    style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${filter === f.key ? "#FF6B35" : "#e0e0e0"}`, background: filter === f.key ? "#FFF3ED" : "#fff", color: filter === f.key ? "#FF6B35" : "#888" }}>
                    {f.label} ({f.key === "all" ? orders.length : orders.filter(o => o.status === f.key).length})
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ padding: "7px 12px", borderRadius: 6, border: "1.5px solid #e0e0e0", fontSize: 12, width: 180, outline: "none" }} />
                <button onClick={() => setShowAddOrder(true)} style={{ padding: "7px 16px", borderRadius: 6, border: "none", background: "linear-gradient(135deg, #FF6B35, #FF8C42)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>+ Add Order</button>
              </div>
            </div>

            {/* Orders List */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: 50, color: "#ccc" }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>📭</div>
                <p style={{ fontSize: 14 }}>No orders found</p>
              </div>
            ) : filtered.map(o => <OrderRow key={o.id} order={o} onView={setViewOrder} />)}
          </>
        )}
      </div>

      {/* Modals */}
      {viewOrder && <OrderDetail order={viewOrder} onClose={() => setViewOrder(null)} onUpdate={handleUpdate} onCancel={handleCancel} />}
      {showAddOrder && <AddOrderModal onClose={() => setShowAddOrder(false)} onAdd={handleAdd} />}
      {showCustomers && <CustomerModal orders={orders} onClose={() => setShowCustomers(false)} />}
    </div>
  );
}
