import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "auth";

const ALLOWED_ROLES = ["admin", "student", "faculty"];

export function normalizeRole(role) {
  if (role == null) return null;
  const s = String(role).toLowerCase().trim();
  return ALLOWED_ROLES.includes(s) ? s : null;
}

function normalizeUser(user) {
  if (!user || typeof user !== "object") return null;
  const id = user.id != null ? String(user.id) : user._id != null ? String(user._id) : null;
  const r = normalizeRole(user.role);
  if (!id || !r) return null;
  return {
    id,
    name: user.name ?? "",
    email: user.email ?? "",
    role: r,
  };
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null, role: null };
    const parsed = JSON.parse(raw);
    const user = normalizeUser(parsed?.user);
    const role = normalizeRole(parsed?.role ?? user?.role);
    const token = typeof parsed?.token === "string" ? parsed.token : null;
    if (!token || !role || !user) {
      return { token: null, user: null, role: null };
    }
    return { token, user: { ...user, role }, role };
  } catch {
    return { token: null, user: null, role: null };
  }
}

function persist(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: state.token, user: state.user, role: state.role })
    );
  } catch {
    // ignore storage errors
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { token, user: rawUser, role: rawRole } = action.payload || {};
      const user = normalizeUser(rawUser);
      const role = normalizeRole(rawRole ?? user?.role);
      state.token = typeof token === "string" && token ? token : null;
      state.user = user;
      state.role = role;
      if (!state.token || !state.role || !state.user) {
        state.token = null;
        state.user = null;
        state.role = null;
      }
      persist(state);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      persist(state);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
