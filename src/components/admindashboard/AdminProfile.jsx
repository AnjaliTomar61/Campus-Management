import React, { useEffect, useState } from "react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    jobTitle: "",
    officeExtension: "",
    officeLocation: "",
    alternatePhone: "",
    joiningDate: "",
    displayTitle: "",
    notes: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/v1/user/me/profile", {
          meta: { suppressErrorToast: true, silent: true },
        });
        if (cancelled) return;
        const u = res.data?.user;
        const p = res.data?.profile;
        setUser(u);
        if (p) {
          setForm({
            jobTitle: p.jobTitle ?? "",
            officeExtension: p.officeExtension ?? "",
            officeLocation: p.officeLocation ?? "",
            alternatePhone: p.alternatePhone ?? "",
            joiningDate: p.joiningDate ? String(p.joiningDate).slice(0, 10) : "",
            displayTitle: p.displayTitle ?? "",
            notes: p.notes ?? "",
          });
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.joiningDate) delete payload.joiningDate;
      await api.put("/api/v1/user/me/profile", payload, {
        meta: { successMessage: "Admin profile saved" },
      });
    } catch {
      // toast from interceptor
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={cx("p-4 sm:p-6", ui.page)}>
        <p className="text-sm text-slate-600">Loading profile…</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className={cx("p-4 sm:p-6", ui.page)}>
        <div className={cx("mx-auto max-w-3xl p-6", ui.card)}>
          <p className="text-sm text-slate-700">
            Sign in as an admin to view and edit this profile. Role-specific details are stored separately from your
            login account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cx("p-4 sm:p-6", ui.page)}>
      <div className={cx("mx-auto max-w-3xl p-6 sm:p-8", ui.card)}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Admin profile</h2>
            <p className="text-sm text-slate-500">Account basics and extended admin details (saved to the server).</p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" value={user.name} />
          <Field label="Email" value={user.email} />
          <Field label="Mobile" value={user.mobile || "—"} />
        </div>

        <form onSubmit={onSave} className="space-y-4 border-t border-slate-100 pt-6">
          <h3 className="text-sm font-semibold text-slate-800">Extended details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Job title" name="jobTitle" value={form.jobTitle} onChange={onChange} />
            <Input label="Display title" name="displayTitle" value={form.displayTitle} onChange={onChange} />
            <Input label="Office extension" name="officeExtension" value={form.officeExtension} onChange={onChange} />
            <Input label="Office location" name="officeLocation" value={form.officeLocation} onChange={onChange} />
            <Input label="Alternate phone" name="alternatePhone" value={form.alternatePhone} onChange={onChange} />
            <Input label="Joining date" name="joiningDate" type="date" value={form.joiningDate} onChange={onChange} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={onChange}
              rows={3}
              className={cx(ui.input, "mt-1 w-full")}
            />
          </div>
          <button type="submit" disabled={saving} className={cx(ui.btnBase, ui.btnPrimary, "min-h-10 px-5")}>
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

function Field({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-900">{value || "—"}</p>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <input {...props} className={ui.input} />
    </div>
  );
}

export default AdminProfile;
