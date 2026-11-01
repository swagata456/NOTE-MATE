// Talks to the Express backend. All paths are relative to /api.
const TOKEN_KEY = 'nm_token';
const USER_KEY = 'nm_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export function getStoredUser() {
  try {
    return getToken() ? JSON.parse(localStorage.getItem(USER_KEY)) : null;
  } catch {
    return null;
  }
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// AuthContext registers a function here that logs the user out when the server says the token is invalid.
let onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error('Cannot reach the server. Make sure the backend is running (npm start).');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* response had no JSON body */
  }

  if (res.status === 401 && token && onUnauthorized) onUnauthorized();
  if (!res.ok) throw new Error((data && data.message) || 'Request failed');
  return data;
}
