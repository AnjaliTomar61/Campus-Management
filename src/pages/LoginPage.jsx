import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/apiClient";
import { setCredentials } from "../store/authSlice";
import { cx, ui } from "../lib/ui";
import { AuthPageShell } from "../components/auth/AuthPageShell";

function dashboardPathForRole(role) {
  if (role === "admin") return "/admindashboard";
  if (role === "faculty") return "/facultydashboard";
  return "/studentdashboard";
}

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
            successMessage: "Welcome back!",
            suppressErrorToast: true,
          },
        }
      );

      const data = res.data;
      if (data?.success === false) {
        throw new Error(data?.message || "Login failed");
      }

      const token = data?.token;
      const user = data?.user;
      const role = user?.role;

      if (!token || !role) {
        throw new Error(data?.message || "Login failed. Missing token or role.");
      }

      dispatch(setCredentials({ token, user, role }));

      const from = searchParams.get("from");
      const hint = searchParams.get("role");
      if (from && from.startsWith("/") && hint && role === hint) {
        navigate(from, { replace: true });
        return;
      }

      navigate(dashboardPathForRole(role), { replace: true });
    } catch (e2) {
      setError(e2?.message || "Login failed");
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
          Sign in with your campus email to open your dashboard.
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
