import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/apiClient";
import { cx, ui } from "../lib/ui";
import { AuthPageShell } from "./auth/AuthPageShell";

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "student",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const canSubmit = useMemo(() => {
    return Boolean(
      form.name?.trim() &&
        form.email?.trim() &&
        form.mobile?.trim() &&
        form.password &&
        form.role &&
        !submitting
    );
  }, [form, submitting]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const res = await api.post(
        "/api/v1/user/signup",
        {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: form.mobile.trim(),
          password: form.password,
          role: form.role,
        },
        {
          meta: {
            successMessage: "Account created. You can sign in now.",
            suppressErrorToast: true,
          },
        }
      );

      const data = res.data;
      if (data?.success === false) {
        throw new Error(data?.message || "Signup failed.");
      }

      navigate("/login", { replace: true });
    } catch (e2) {
      setFormError(e2?.message || "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageShell wide>
      <header className="mb-7 text-center sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">
          Create your account
        </h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
          Register as a student or faculty member. Admin access is assigned by your institution.
        </p>
      </header>

      {formError ? (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200/90 bg-red-50 px-4 py-3 text-sm leading-snug text-red-800"
        >
          {formError}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-name" className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            className={ui.input}
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label htmlFor="signup-email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className={ui.input}
              placeholder="you@mail.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label htmlFor="signup-mobile" className="text-sm font-medium text-slate-700">
              Mobile
            </label>
            <input
              id="signup-mobile"
              name="mobile"
              type="tel"
              value={form.mobile}
              onChange={onChange}
              className={ui.input}
              placeholder="10-digit number"
              autoComplete="tel"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            className={ui.input}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-role" className="text-sm font-medium text-slate-700">
            Role
          </label>
          <select
            id="signup-role"
            name="role"
            value={form.role}
            onChange={onChange}
            className={ui.select}
            required
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:pt-7">
          <button
            type="submit"
            disabled={!canSubmit}
            className={cx(ui.btnBase, ui.btnPrimary, "w-full min-h-11 shadow-sm")}
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className={cx(ui.btnBase, ui.btnSoft, "w-full min-h-11")}
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </AuthPageShell>
  );
}
