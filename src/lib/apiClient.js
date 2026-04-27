import axios from "axios";
import { notify } from "./notify";
import { store } from "../store/store.js";
import { logout } from "../store/authSlice.js";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function formatValidatorErrors(data) {
  if (!Array.isArray(data?.errors) || data.errors.length === 0) return null;
  return data.errors
    .map((e) => (typeof e === "string" ? e : e?.msg || e?.message))
    .filter(Boolean)
    .join(" · ");
}

function normalizeError(error) {
  if (error?.response) {
    const status = error.response.status;
    const data = error.response.data;
    let message =
      data?.message ||
      data?.error ||
      (typeof data === "string" ? data : null) ||
      `Request failed (${status})`;

    const joined = formatValidatorErrors(data);
    if (joined) message = joined;

    return {
      kind: "http",
      status,
      message,
      data,
      raw: error,
    };
  }

  if (error?.request) {
    return {
      kind: "network",
      status: null,
      message: "Network error. Please check your internet or server.",
      data: null,
      raw: error,
    };
  }

  return {
    kind: "unknown",
    status: null,
    message: error?.message || "Something went wrong.",
    data: null,
    raw: error,
  };
}

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("auth");
      const parsed = raw ? JSON.parse(raw) : null;
      const token = parsed?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(normalizeError(error))
);

api.interceptors.response.use(
  (response) => {
    const successMessage = response?.config?.meta?.successMessage;
    if (successMessage) {
      notify({ type: "success", message: successMessage });
    }
    return response;
  },
  (error) => {
    const normalized = normalizeError(error);

    const url = String(error?.config?.url || "");
    const isAuthRoute = /\/api\/v1\/user\/(login|signup)\b/.test(url);

    if (normalized.status === 401 && !isAuthRoute) {
      store.dispatch(logout());
    }

    const suppress =
      error?.config?.meta?.suppressErrorToast ||
      error?.config?.meta?.silent ||
      false;

    if (!suppress) {
      notify({ type: "error", message: normalized.message });
    }

    return Promise.reject(normalized);
  }
);
