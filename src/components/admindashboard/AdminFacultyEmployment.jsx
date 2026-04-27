import { useEffect, useState, useCallback } from "react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

export default function AdminFacultyEmployment({ embedded = false }) {
  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [facultyUserId, setFacultyUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    department: "",
    designation: "Lecturer",
    employeeId: "",
    isActive: true,
  });
  const [summary, setSummary] = useState(null);

  const loadLists = useCallback(async () => {
    const [usersRes, depRes] = await Promise.all([
      api.get("/api/v1/user/getalluser"),
      api.get("/api/department/all").catch(() => ({ data: {} })),
    ]);
    const all = usersRes.data?.data || [];
    setFacultyList(all.filter((u) => u.role === "faculty"));
    setDepartments((depRes.data?.departments || []).filter((d) => d.isActive !== false));
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const loadPlacement = async (id) => {
    if (!id) {
      setSummary(null);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/api/v1/user/admin/faculty/${id}/placement`);
      setSummary(res.data);
      const p = res.data?.profile;
      const emp = res.data?.employment;
      setForm({
        department: p?.department?._id ? String(p.department._id) : p?.department ? String(p.department) : "",
        designation: p?.designation || emp?.designation || "Lecturer",
        employeeId: p?.employeeId || emp?.employeeId || "",
        isActive: p?.isActive !== false && emp?.isActive !== false,
      });
    } catch {
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (facultyUserId) {
      loadPlacement(facultyUserId);
    } else {
      setSummary(null);
      setForm({ department: "", designation: "Lecturer", employeeId: "", isActive: true });
    }
  }, [facultyUserId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!facultyUserId) return;
    setSaving(true);
    try {
      await api.put(
        `/api/v1/user/admin/faculty/${facultyUserId}/employment`,
        {
          department: form.department || null,
          designation: form.designation,
          employeeId: form.employeeId.trim() || undefined,
          isActive: form.isActive,
        },
        { meta: { successMessage: "Faculty placement saved" } }
      );
      await loadPlacement(facultyUserId);
    } catch {
      //
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={embedded ? "mx-auto max-w-xl" : cx("p-4 sm:p-6", ui.page)}>
      {embedded ? (
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          Set employee ID, catalog department, and designation. Faculty cannot change these from their own profile.
        </p>
      ) : (
        <div className={cx(ui.cardHeader, "mb-6")}>
          <div>
            <h1 className={ui.h1}>Faculty placement</h1>
            <p className="text-sm text-slate-500">
              Employee ID, department, and designation on the official record are managed here. Faculty members cannot
              change these on their own profile screen.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className={cx(ui.card, !embedded && "mx-auto", "space-y-5 p-6 sm:p-8")}>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Faculty member</label>
          <select
            className={ui.select}
            value={facultyUserId}
            onChange={(e) => setFacultyUserId(e.target.value)}
            required
          >
            <option value="">Select faculty…</option>
            {facultyList.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name} — {f.email}
              </option>
            ))}
          </select>
        </div>

        {loading ? <p className="text-sm text-slate-500">Loading…</p> : null}

        {summary?.user ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-xs text-slate-600">
            <p>
              <span className="font-medium text-slate-800">{summary.user.name}</span>
              {form.employeeId?.trim() ? (
                <>
                  {" "}
                  · Employee ID:{" "}
                  <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-900">
                    {form.employeeId.trim()}
                  </code>
                </>
              ) : (
                <span className="text-slate-500"> · No employee ID set yet</span>
              )}
            </p>
          </div>
        ) : null}

        <div className="border-t border-slate-100 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Placement and HR</p>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Employee ID</label>
            <input
              className={ui.input}
              value={form.employeeId}
              onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
              placeholder="e.g. EMP202600001 (must match portal / HR record)"
              disabled={!facultyUserId || loading}
            />
            <p className="text-xs text-slate-500">
              Shown on staff roster and linked to the faculty HR row. Leave blank only if not assigned yet.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Catalog department</label>
            <select
              className={ui.select}
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              disabled={!facultyUserId || loading}
            >
              <option value="">—</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Designation</label>
            <select
              className={ui.select}
              value={form.designation}
              onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
              disabled={!facultyUserId || loading}
            >
              <option value="Lecturer">Lecturer</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Professor">Professor</option>
              <option value="HOD">HOD</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            disabled={!facultyUserId || loading}
          />
          Active on staff roster
        </label>

        {summary?.employment ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <span className="font-medium text-slate-700">HR row:</span>{" "}
            {summary.employment.employeeId ? (
              <>
                ID <code className="mx-0.5 rounded bg-white px-1 font-mono text-[11px]">{summary.employment.employeeId}</code>
                ·{" "}
              </>
            ) : null}
            {summary.employment.departmentName || "—"} · {summary.employment.designation || "—"}
          </div>
        ) : null}

        <button type="submit" disabled={!facultyUserId || saving} className={cx(ui.btnBase, ui.btnPrimary, "w-full")}>
          {saving ? "Saving…" : "Save placement"}
        </button>
      </form>
    </div>
  );
}
