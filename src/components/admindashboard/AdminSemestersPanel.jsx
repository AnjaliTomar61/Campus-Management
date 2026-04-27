import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarRange, Pencil, Power, Plus, RefreshCw, Trash2 } from "lucide-react";
import { api } from "../../lib/apiClient";
import Modal from "../common/Modal";
import { cx, ui } from "../../lib/ui";

function courseLabel(c) {
  if (!c || typeof c !== "object") return "—";
  const dep = c.department;
  const depPart = dep && typeof dep === "object" ? ` · ${dep.name}` : "";
  return `${c.courseName} (${c.courseCode})${depPart}`;
}

function StatusBadge({ active }) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        active !== false ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
      )}
    >
      {active !== false ? "Active" : "Inactive"}
    </span>
  );
}

export default function AdminSemestersPanel() {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [courseFilter, setCourseFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const [form, setForm] = useState({ course: "", number: 1, title: "" });

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        api.get("/api/course/all"),
        api.get("/api/semesters", {
          params: courseFilter ? { courseId: courseFilter } : undefined,
        }),
      ]);
      setCourses((cRes.data?.courses || []).filter((c) => c.isActive !== false));
      setSemesters(sRes.data?.semesters || []);
    } catch {
      setCourses([]);
      setSemesters([]);
    } finally {
      setLoading(false);
    }
  }, [courseFilter]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const filteredSemesters = useMemo(() => {
    if (!courseFilter) return semesters;
    return semesters.filter((s) => String(s.course?._id || s.course) === String(courseFilter));
  }, [semesters, courseFilter]);

  const openCreate = () => {
    setEditRow(null);
    setForm({
      course: courseFilter || "",
      number: 1,
      title: "",
    });
    setAddOpen(true);
  };

  const openEdit = (row) => {
    setEditRow(row);
    setForm({
      course: String(row.course?._id || row.course || ""),
      number: row.number,
      title: row.title || "",
    });
    setAddOpen(true);
  };

  const closeModal = () => {
    setAddOpen(false);
    setEditRow(null);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const course = form.course;
    const number = Number(form.number);
    if (!course || !Number.isFinite(number)) return;
    try {
      if (editRow?._id) {
        await api.put(
          `/api/semesters/${editRow._id}`,
          { course, number, title: form.title.trim() },
          { meta: { successMessage: "Semester updated" } }
        );
      } else {
        await api.post(
          "/api/semesters",
          { course, number, title: form.title.trim() },
          { meta: { successMessage: "Semester created" } }
        );
      }
      closeModal();
      await loadAll();
    } catch {
      //
    }
  };

  const toggleActive = async (id) => {
    setBusyId(id);
    try {
      await api.patch(`/api/semesters/toggle/${id}`, {}, { meta: { successMessage: "Status updated" } });
      await loadAll();
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget);
    try {
      await api.delete(`/api/semesters/${deleteTarget}`, { meta: { successMessage: "Semester removed" } });
      setDeleteTarget(null);
      await loadAll();
    } catch {
      //
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className={cx("p-4 sm:p-6 lg:p-8", ui.page)}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className={cx(ui.h1, "flex items-center gap-2 tracking-tight")}>
            <CalendarRange className="h-8 w-8 text-(--brand-blue)" aria-hidden />
            Semesters
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
            Define semester rows per course (Semester 1…N). Student “current semester” and subjects attach to these
            records. Course total semesters caps how many numbers you should add.
          </p>
        </div>
        <button
          type="button"
          onClick={loadAll}
          disabled={loading}
          className={cx(ui.btnBase, ui.btnSoft, "shrink-0 self-start sm:self-auto")}
        >
          <RefreshCw className={cx("h-4 w-4", loading && "animate-spin")} aria-hidden />
          Refresh
        </button>
      </div>

      <div className={cx(ui.card, "mb-6 p-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between sm:gap-4")}>
        <div className="min-w-0 flex-1">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Filter by course
          </label>
          <select
            className={cx(ui.select, "max-w-md")}
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="">All courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.courseName} ({c.courseCode})
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={openCreate}
          disabled={courses.length === 0}
          className={cx(ui.btnBase, ui.btnPrimary, "mt-4 sm:mt-0")}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add semester
        </button>
      </div>

      <div className={ui.dashTableCard}>
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {loading ? "Loading…" : `${filteredSemesters.length} semester row(s)`}
          </p>
        </div>
        <div className={ui.dashTableScroller}>
          <table className={cx(ui.dashTable, "min-w-[720px]")}>
            <thead>
              <tr className={ui.dashTableHead}>
                <th className={ui.dashTableTh}>Course</th>
                <th className={ui.dashTableTh}>No.</th>
                <th className={ui.dashTableTh}>Title</th>
                <th className={ui.dashTableTh}>Status</th>
                <th className={ui.dashTableTh}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSemesters.map((s) => (
                <tr key={s._id} className={ui.dashTableRow}>
                  <td className={cx(ui.dashTableTd, "font-medium text-slate-900")}>{courseLabel(s.course)}</td>
                  <td className={ui.dashTableTd}>
                    <span className="font-semibold">{s.number}</span>
                  </td>
                  <td className={ui.dashTableTd}>{s.title || "—"}</td>
                  <td className={ui.dashTableTd}>
                    <StatusBadge active={s.isActive} />
                  </td>
                  <td className={ui.dashTableTd}>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        className={cx(ui.btnBase, ui.btnSoft, "px-2.5 py-1.5 text-xs")}
                        onClick={() => openEdit(s)}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                        Edit
                      </button>
                      <button
                        type="button"
                        className={cx(ui.btnBase, ui.btnSoft, "px-2.5 py-1.5 text-xs")}
                        disabled={busyId === s._id}
                        onClick={() => toggleActive(s._id)}
                      >
                        <Power className="h-3.5 w-3.5" aria-hidden />
                        Toggle
                      </button>
                      <button
                        type="button"
                        className={cx(
                          ui.btnBase,
                          "border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs text-red-800 hover:bg-red-100"
                        )}
                        onClick={() => setDeleteTarget(s._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filteredSemesters.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            No semesters yet. Pick a course (optional filter) and click <strong>Add semester</strong>.
          </p>
        ) : null}
      </div>

      <Modal
        open={addOpen}
        title={editRow ? "Edit semester" : "Add semester"}
        onClose={closeModal}
        maxWidthClassName="max-w-lg"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className={cx(ui.btnBase, ui.btnSoft)} onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" form="semester-admin-form" className={cx(ui.btnBase, ui.btnPrimary)}>
              {editRow ? "Save" : "Create"}
            </button>
          </div>
        }
      >
        <form id="semester-admin-form" onSubmit={submitForm} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Course</label>
            <select
              className={ui.select}
              value={form.course}
              onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
              required
            >
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.courseName} ({c.courseCode})
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Semester number
              </label>
              <input
                type="number"
                min={1}
                max={12}
                className={ui.input}
                value={form.number}
                onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Title (optional)
              </label>
              <input
                className={ui.input}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Odd semester 2025"
              />
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete semester?"
        onClose={() => setDeleteTarget(null)}
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className={cx(ui.btnBase, ui.btnSoft)} onClick={() => setDeleteTarget(null)}>
              Cancel
            </button>
            <button
              type="button"
              className={cx(ui.btnBase, ui.btnDanger)}
              disabled={busyId === deleteTarget}
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        }
      >
        <p className="text-sm text-slate-700">
          You cannot delete a semester if students use it as <strong>current semester</strong> or if subjects are
          linked. If delete fails, reassign those records first.
        </p>
      </Modal>
    </div>
  );
}
