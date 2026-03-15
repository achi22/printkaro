// ═══ PrintKaaro API Helper ═══
// This connects your frontend to the backend on Render

const API_URL = "https://printkaaro-api.onrender.com";

// Store token in memory
let authToken = localStorage.getItem("pk_token") || null;

function setToken(token) {
  authToken = token;
  if (token) localStorage.setItem("pk_token", token);
  else localStorage.removeItem("pk_token");
}

function getToken() {
  return authToken;
}

// Base fetch wrapper
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
  const data = await api("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, phone, email, password }),
  });
  setToken(data.token);
  return data.user;
}

export async function signin(phone, password) {
  const data = await api("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ phone, password }),
  });
  setToken(data.token);
  return data.user;
}

export async function getProfile() {
  const data = await api("/api/auth/me");
  return data.user;
}

export function signout() {
  setToken(null);
}

export function isLoggedIn() {
  return !!authToken;
}

// ── ORDERS ──
export async function uploadPDF(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/orders/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${authToken}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Upload failed");
  }
  return res.json();
}

export async function createOrder(orderData) {
  const data = await api("/api/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
  return data.order;
}

export async function getMyOrders() {
  const data = await api("/api/orders/my");
  return data.orders;
}

export async function getOrder(id) {
  const data = await api(`/api/orders/${id}`);
  return data.order;
}

// ── ADMIN ──
export async function adminLogin(password) {
  const data = await api("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
  return data;
}

export async function getAdminStats() {
  const data = await api("/api/admin/stats");
  return data;
}

export async function getAdminOrders(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const data = await api(`/api/admin/orders?${params}`);
  return data;
}

export async function updateOrderStatus(id, status, note) {
  const data = await api(`/api/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, note }),
  });
  return data.order;
}

export async function updateOrder(id, updates) {
  const data = await api(`/api/admin/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return data.order;
}

export async function getCustomers() {
  const data = await api("/api/admin/customers");
  return data.customers;
}

export async function addManualOrder(orderData) {
  const data = await api("/api/admin/orders/manual", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
  return data.order;
}

export { API_URL };
