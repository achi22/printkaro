const API_URL = "https://printkaaro-api.onrender.com";
let authToken = localStorage.getItem("pk_token") || null;
let adminPassword = localStorage.getItem("pk_admin") || null;

function setToken(t) { authToken = t; if (t) localStorage.setItem("pk_token", t); else localStorage.removeItem("pk_token"); }
export function isLoggedIn() { return !!authToken; }
export function signout() { setToken(null); adminPassword = null; localStorage.removeItem("pk_admin"); }
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
const CHUNK_SIZE = 8 * 1024 * 1024; // 8MB chunks

export async function uploadPDF(file, onProgress) {
  // Small files (<8MB) — single upload with progress
  if (file.size <= CHUNK_SIZE) {
    if (onProgress) onProgress(10);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_URL}/api/orders/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 90) + 5);
        }
      };
      xhr.onload = () => {
        if (onProgress) onProgress(100);
        if (xhr.status >= 200 && xhr.status < 300) {
          try { resolve(JSON.parse(xhr.responseText)); } catch { reject(new Error("Invalid response")); }
        } else {
          try { const e = JSON.parse(xhr.responseText); reject(new Error(e.error || "Upload failed")); } catch { reject(new Error("Upload failed")); }
        }
      };
      xhr.onerror = () => reject(new Error("Network error — check your internet"));
      xhr.ontimeout = () => reject(new Error("Upload timed out"));
      xhr.timeout = 5 * 60 * 1000; // 5 min
      const fd = new FormData(); fd.append("file", file);
      xhr.send(fd);
    });
  }

  // Large files — chunked upload (sequential, streamed to GridFS)
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const uploadId = Date.now() + "_" + Math.random().toString(36).slice(2, 8);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const fd = new FormData();
    fd.append("chunk", chunk);
    fd.append("uploadId", uploadId);
    fd.append("chunkIndex", i);
    fd.append("totalChunks", totalChunks);
    fd.append("fileName", file.name);
    fd.append("mimeType", file.type || "application/pdf");
    fd.append("fileSize", file.size);

    // Retry each chunk up to 3 times
    let chunkOk = false;
    for (let attempt = 0; attempt < 3 && !chunkOk; attempt++) {
      try {
        const res = await fetch(`${API_URL}/api/orders/upload-chunk`, {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` },
          body: fd,
        });

        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          if (attempt === 2) throw new Error(e.error || `Chunk ${i + 1}/${totalChunks} failed`);
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }

        const data = await res.json();
        if (onProgress) onProgress(Math.round(((i + 1) / totalChunks) * 100));
        
        // Last chunk returns the file info
        if (data.filePath) return data;
        chunkOk = true;
      } catch (err) {
        if (attempt === 2) throw err;
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  throw new Error("Upload completed but no file ID returned");
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
export async function adminLogin(pw) { const d = await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password: pw }) }); adminPassword = pw; localStorage.setItem("pk_admin", pw); return d; }
export async function getAdminStats() { return api("/api/admin/stats", { headers: ah() }); }
export async function getAdminOrders(f = {}) { const p = new URLSearchParams(f).toString(); return api(`/api/admin/orders?${p}`, { headers: ah() }); }
export async function updateOrderStatus(id, status, note) { return (await api(`/api/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, note }), headers: ah() })).order; }
export async function updateOrder(id, u) { return (await api(`/api/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify(u), headers: ah() })).order; }
export async function getCustomers() { return (await api("/api/admin/customers", { headers: ah() })).customers; }
export async function addManualOrder(d) { return (await api("/api/admin/orders/manual", { method: "POST", body: JSON.stringify(d), headers: ah() })).order; }
export async function deleteOrder(id) { return api(`/api/admin/orders/${id}`, { method: "DELETE", headers: ah() }); }
export async function cleanupOldOrders() { return api("/api/admin/orders-cleanup", { method: "DELETE", headers: ah() }); }
export function getAdminPdfUrl(orderId) { return `${API_URL}/api/orders/${orderId}/file?adminpass=${adminPassword}`; }

// ── SHIPROCKET ──
export async function srCreateShipment(orderId) { return api("/api/admin/shiprocket/ship", { method: "POST", body: JSON.stringify({ orderId }), headers: ah() }); }
export async function srGetCouriers(shipmentId) { return api("/api/admin/shiprocket/couriers", { method: "POST", body: JSON.stringify({ shipmentId }), headers: ah() }); }
export async function srAssignCourier(shipmentId, courierId, orderId) { return api("/api/admin/shiprocket/assign", { method: "POST", body: JSON.stringify({ shipmentId, courierId, orderId }), headers: ah() }); }
export async function srTrack(orderId) { return api(`/api/admin/shiprocket/track/${orderId}`, { headers: ah() }); }
export async function srCancel(orderId) { return api("/api/admin/shiprocket/cancel", { method: "POST", body: JSON.stringify({ orderId }), headers: ah() }); }
export async function srCheckPin(pincode, weight, cod) { return api("/api/admin/shiprocket/check", { method: "POST", body: JSON.stringify({ pincode, weight, cod }), headers: ah() }); }
