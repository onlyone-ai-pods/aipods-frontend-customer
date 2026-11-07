/**
 * Sesión del portal (SPEC-CORE-67.R10).
 *
 * El token JWT vive solo en memoria de este módulo: nunca en localStorage ni
 * sessionStorage, para que un script inyectado no lo pueda leer después.
 * Recargar la página cierra la sesión.
 */

const API_BASE = '/api/v1';

let session = null; // { token, expiresAt, user: { id, email, tenant_id, roles } }
let expiryTimer = null;
const listeners = new Set();

function setSession(next) {
  session = next;
  clearTimeout(expiryTimer);
  if (next && next.expiresAt) {
    const ms = new Date(next.expiresAt).getTime() - Date.now();
    if (ms > 0) expiryTimer = setTimeout(() => setSession(null), ms);
  }
  listeners.forEach((fn) => fn(session));
}

export function getSession() {
  return session;
}

export function onSessionChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function hasRole(...roles) {
  return !!session && roles.some((r) => (session.user.roles || []).includes(r));
}

/** Tenant de la sesión, o el de demo cuando el core corre sin login. */
export function currentTenant(fallback) {
  return session ? session.user.tenant_id : fallback;
}

/**
 * Pregunta al core si exige login. Devuelve 'enforce' u 'off'.
 * Un core anterior a SPEC-CORE-67 no tiene /auth/me (404) y se toma como 'off'.
 */
export async function fetchAuthMode() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`);
    // Con enforce, /auth/me sin token responde 401: eso ya dice que hay login.
    if (res.status === 401) return 'enforce';
    if (!res.ok) return 'off';
    const data = await res.json();
    return data.auth_mode === 'enforce' ? 'enforce' : 'off';
  } catch {
    return 'off';
  }
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(res.status === 401 ? 'Email o contraseña incorrectos.' : data.error || 'No se pudo iniciar sesión.');
  }
  setSession({ token: data.access_token, expiresAt: data.expires_at, user: data.user });
  return session;
}

export function logout() {
  setSession(null);
}

/**
 * fetch con el token de la sesión. Si el core responde 401 (token vencido o
 * inválido), cierra la sesión para que el portal vuelva al login.
 */
export async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (session) headers.Authorization = `Bearer ${session.token}`;
  const res = await fetch(path, { ...options, headers });
  if (res.status === 401 && session) setSession(null);
  return res;
}

/**
 * Cambia la contraseña del usuario de la sesión (SPEC-CORE-67.R11).
 * Una contraseña actual incorrecta responde 400 y la sesión sigue abierta.
 */
export async function changePassword(currentPassword, newPassword) {
  const res = await apiFetch(`${API_BASE}/auth/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'No se pudo cambiar la contraseña.');
}
