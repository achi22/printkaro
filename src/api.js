const API_URL = "https://printkaaro-api.onrender.com";
let authToken = localStorage.getItem("pk_token") || null;
let adminPassword = null;

function setToken(t) { authToken = t; if (t) localStorage.setItem("pk_token", t); else localStorage.removeItem("pk_token"); }
export function isLoggedIn() { return !!authToken; }
export function signout() { setToken(null); adminPassword = null; }
export { API_URL };

async function api(endpoint, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

// ── AUTH ──
export async function signup(name, phone, email, password) {
  const data = await api("/api/auth/signup", { method: "POST", body: JSON.stringify({ name, phone, email, password }) });
  setToken(data.token); return data.user;
}
export async function signin(phone, password) {
  const data = await api("/api/auth/signin", { method: "POST", body: JSON.stringify({ phone, password }) });
  setToken(data.token); return data.user;
}
export async function getProfile() { return (await api("/api/auth/me")).user; }

// ── ORDERS ──
export async function uploadPDF(file) {
  const fd = new FormData(); fd.append("file", file);
  const res = await fetch(`${API_URL}/api/orders/upload`, { method: "POST", headers: { Authorization: `Bearer ${authToken}` }, body: fd });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Upload failed"); }
  return res.json();
}
export async function createOrder(d) { return (await api("/api/orders", { method: "POST", body: JSON.stringify(d) })).order; }
export async function getMyOrders() { return (await api("/api/orders/my")).orders; }
export async function getOrder(id) { return (await api(`/api/orders/${id}`)).order; }
export async function cancelOrder(id) { return (await api(`/api/orders/${id}/cancel`, { method: "PATCH" })).order; }
export function getPdfUrl(id) { return `${API_URL}/api/orders/${id}/file?token=${authToken}`; }

// ── SAVED ADDRESSES (local storage) ──
export function getSavedAddresses() {
  try { return JSON.parse(localStorage.getItem("pk_addresses") || "[]"); } catch { return []; }
}
export function saveAddress(addr) {
  const list = getSavedAddresses();
  const exists = list.findIndex(a => a.address === addr.address && a.pincode === addr.pincode);
  if (exists >= 0) list.splice(exists, 1);
  list.unshift(addr);
  localStorage.setItem("pk_addresses", JSON.stringify(list.slice(0, 5)));
}

// ── ADMIN ──
function ah() { return adminPassword ? { "x-admin-password": adminPassword } : {}; }
export async function adminLogin(pw) { const d = await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password: pw }) }); adminPassword = pw; return d; }
export async function getAdminStats() { return api("/api/admin/stats", { headers: ah() }); }
export async function getAdminOrders(f = {}) { const p = new URLSearchParams(f).toString(); return api(`/api/admin/orders?${p}`, { headers: ah() }); }
export async function updateOrderStatus(id, status, note) { return (await api(`/api/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, note }), headers: ah() })).order; }
export async function updateOrder(id, u) { return (await api(`/api/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify(u), headers: ah() })).order; }
export async function getCustomers() { return (await api("/api/admin/customers", { headers: ah() })).customers; }
export async function addManualOrder(d) { return (await api("/api/admin/orders/manual", { method: "POST", body: JSON.stringify(d), headers: ah() })).order; }
export function getAdminPdfUrl(orderId) { return `${API_URL}/api/orders/${orderId}/file`; }
