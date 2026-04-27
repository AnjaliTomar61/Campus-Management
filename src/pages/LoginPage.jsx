import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/apiClient";
import { normalizeRole, setCredentials } from "../store/authSlice";
import { notify } from "../lib/notify";
import { cx, ui } from "../lib/ui";
import { AuthPageShell } from "../components/auth/AuthPageShell";

function dashboardPathForRole(role) {
  if (role === "admin") return "/admindashboard";
  if (role === "faculty") return "/facultydashboard";
  return "/studentdashboard";
}

/** Map Mongoose-style doc to the shape `authSlice` expects (no password). */
function userFromDoc(doc) {
  if (!doc || typeof doc !== "object") return null;
  const id = doc.id ?? doc._id;
  if (id == null) return null;
  const role = normalizeRole(doc.role);
  if (!role) return null;
  return {
    id: String(id),
    name: doc.name ?? "",
    email: doc.email ?? "",
    role,
    mobile: doc.mobile ?? "",
  };
}

/**
 * Normalize login JSON: supports
 * - `{ token, user }`
 * - `{ token, data: { token, user } }` (nested)
 * - `{ token, data: <mongoose user doc> }` (token at root only)
 */
function unwrapAuthPayload(data) {
  if (!data || typeof data !== "object") return null;
  if (data.token && data.user) return data;

  const inner = data.data;
  if (inner && typeof inner === "object") {
    if (inner.token && inner.user) {
      return { success: data.success, message: data.message, token: inner.token, user: inner.user, role: inner.role };
    }
    if (inner.token) {
      const user = userFromDoc(inner.user) || userFromDoc(inner);
      if (user) return { success: data.success, message: data.message, token: inner.token, user, role: user.role };
    }
  }

  if (data.token && !data.user) {
    const user = userFromDoc(data.data);
    if (user) return { ...data, user, role: user.role };
  }

  return data;
}

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return Boolean(form.email?.trim() && form.password && !submitting);
  }, [form.email, form.password, submitting]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post(
        "/api/v1/user/login",
        {
          email: form.email.trim().toLowerCase(),
          password: form.password,
        },
        {
          meta: {
            suppressErrorToast: true,
          },
        }
      );

      const raw = unwrapAuthPayload(res.data);
      if (!raw || raw.success === false) {
        throw new Error(raw?.message || "Login failed");
      }

      const token = typeof raw.token === "string" ? raw.token : null;
      const userRaw = raw.user;
      const role = normalizeRole(userRaw?.role ?? raw.role);

      if (!token || !role) {
        throw new Error(raw?.message || "Login failed. Missing token or role.");
      }

      const id =
        userRaw?.id != null
          ? String(userRaw.id)
          : userRaw?._id != null
            ? String(userRaw._id)
            : null;
      if (!id) {
        throw new Error(raw?.message || "Login failed. User id missing from server response.");
      }

      const userForStore = {
        ...userRaw,
        id,
        role,
      };

      dispatch(setCredentials({ token, user: userForStore, role }));

      const fromQuery = searchParams.get("from");
      const fromState = location.state?.from;
      const from =
        (typeof fromQuery === "string" && fromQuery.startsWith("/") && fromQuery) ||
        (typeof fromState === "string" && fromState.startsWith("/") ? fromState : null);
      const hint = normalizeRole(searchParams.get("role"));
      const target =
        from && hint && role === hint
          ? from
          : dashboardPathForRole(role);

      notify({ type: "success", message: "Welcome back!" });
      queueMicrotask(() => {
        navigate(target, { replace: true });
      });
    } catch (e2) {
      const msg =
        e2 && typeof e2 === "object" && "message" in e2
          ? String(e2.message)
          : typeof e2 === "string"
            ? e2
            : "Login failed";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageShell wide={false}>
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">
          Welcome back
        </h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
          Sign in with your campus email (student, faculty, or admin). If your department created your faculty
          account, use your official email on this page—the same address used in the faculty directory.
        </p>
      </header>

      {error ? (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200/90 bg-red-50 px-4 py-3 text-sm leading-snug text-red-800"
        >
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className={ui.input}
            placeholder="you@svvv.edu.in"
            autoComplete="email"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            className={ui.input}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className={cx(ui.btnBase, ui.btnPrimary, "w-full min-h-11 shadow-sm")}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-xs text-slate-500">New to the portal?</p>

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className={cx(ui.btnBase, ui.btnSoft, "w-full min-h-11")}
          >
            Create an account
          </button>
        </div>
      </form>
    </AuthPageShell>
  );
}
