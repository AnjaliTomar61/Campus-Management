import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, BookMarked, Pencil, Power, Trash2, RefreshCw, Plus } from "lucide-react";
import { api } from "../../lib/apiClient";
import Modal from "../common/Modal";
import { cx, ui } from "../../lib/ui";

const TABS = [
  {
    id: "departments",
    label: "Departments",
    icon: Building2,
    desc: "Schools and divisions students and faculty belong to",
  },
  {
    id: "courses",
    label: "Courses & programs",
    icon: BookMarked,
    desc: "Degree programs linked to a department (duration, fees, semesters)",
  },
];

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

export default function AdminProgramsPanel() {
  const [tab, setTab] = useState("departments");
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const [deptForm, setDeptForm] = useState({ name: "", code: "", description: "" });
  const [courseForm, setCourseForm] = useState({
    courseName: "",
    courseCode: "",
    department: "",
    duration: "",
    totalSemesters: "6",
    fees: "0",
    description: "",
    eligibility: "",
  });

  const [editDept, setEditDept] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [addDeptOpen, setAddDeptOpen] = useState(false);
  const [addCourseOpen, setAddCourseOpen] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [dRes, cRes] = await Promise.all([
        api.get("/api/department/all"),
        api.get("/api/course/all"),
      ]);
      setDepartments(dRes.data?.departments || []);
      setCourses(cRes.data?.courses || []);
    } catch {
      setDepartments([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const deptById = useMemo(() => {
    const m = new Map();
    departments.forEach((d) => m.set(String(d._id), d));
    return m;
  }, [departments]);

  const activeDepartments = useMemo(
    () => departments.filter((d) => d.isActive !== false),
    [departments]
  );

  const submitDepartment = async (e) => {
    e.preventDefault();
    const name = deptForm.name.trim();
    const code = deptForm.code.trim();
    if (!name || !code) return;
    try {
      await api.post(
        "/api/department/create",
        { name, code, description: deptForm.description.trim() || undefined },
        { meta: { successMessage: "Department created" } }
      );
      setDeptForm({ name: "", code: "", description: "" });
      setAddDeptOpen(false);
      await loadAll();
    } catch {
      /* toast */
    }
  };

  const submitCourse = async (e) => {
    e.preventDefault();
    const courseName = courseForm.courseName.trim();
    const courseCode = courseForm.courseCode.trim();
    const department = courseForm.department;
    const duration = courseForm.duration.trim();
    const totalSemesters = Number(courseForm.totalSemesters);
    const fees = Number(courseForm.fees);
    if (!courseName || !courseCode || !department || !duration) return;
    if (!Number.isFinite(totalSemesters) || totalSemesters < 1) return;
    if (!Number.isFinite(fees) || fees < 0) return;
    try {
      await api.post(
        "/api/course/create",
        {
          courseName,
          courseCode,
          department,
          duration,
          totalSemesters,
          fees,
          description: courseForm.description.trim() || undefined,
          eligibility: courseForm.eligibility.trim() || undefined,
        },
        { meta: { successMessage: "Course created" } }
      );
      setCourseForm({
        courseName: "",
        courseCode: "",
        department: "",
        duration: "",
        totalSemesters: "6",
        fees: "0",
        description: "",
        eligibility: "",
      });
      setAddCourseOpen(false);
      await loadAll();
    } catch {
      /* toast */
    }
  };

  const toggleDepartment = async (id) => {
    setBusyId(id);
    try {
      await api.patch(`/api/department/toggle/${id}`, {}, { meta: { successMessage: "Status updated" } });
      await loadAll();
    } finally {
      setBusyId(null);
    }
  };

  const toggleCourse = async (id) => {
    setBusyId(id);
    try {
      await api.patch(`/api/course/toggle/${id}`, {}, { meta: { successMessage: "Status updated" } });
      await loadAll();
    } finally {
      setBusyId(null);
    }
  };

  const saveEditDept = async (e) => {
    e.preventDefault();
    if (!editDept?._id) return;
    try {
      await api.put(
        `/api/department/${editDept._id}`,
        {
          name: editDept.name.trim(),
          code: editDept.code.trim(),
          description: editDept.description?.trim() || "",
          isActive: editDept.isActive !== false,
        },
        { meta: { successMessage: "Department saved" } }
      );
      setEditDept(null);
      await loadAll();
    } catch {
      /* */
    }
  };

  const saveEditCourse = async (e) => {
    e.preventDefault();
    if (!editCourse?._id) return;
    const totalSemesters = Number(editCourse.totalSemesters);
    const fees = Number(editCourse.fees);
    try {
      await api.put(
        `/api/course/${editCourse._id}`,
        {
          courseName: editCourse.courseName.trim(),
          courseCode: editCourse.courseCode.trim(),
          department: editCourse.department,
          duration: String(editCourse.duration || "").trim(),
          totalSemesters,
          fees,
          description: editCourse.description?.trim() || "",
          eligibility: editCourse.eligibility?.trim() || "",
          isActive: editCourse.isActive !== false,
        },
        { meta: { successMessage: "Course saved" } }
      );
      setEditCourse(null);
      await loadAll();
    } catch {
      /* */
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    setBusyId(id);
    try {
      if (type === "department") {
        await api.delete(`/api/department/${id}`, { meta: { successMessage: "Department removed" } });
      } else {
        await api.delete(`/api/course/${id}`, { meta: { successMessage: "Course removed" } });
      }
      setDeleteTarget(null);
      await loadAll();
    } catch {
      /* */
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className={cx("p-4 sm:p-6 lg:p-8", ui.page)}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className={cx(ui.h1, "tracking-tight")}>Programs & structure</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
            Define your academic hierarchy: departments first, then courses (programs) under each department. Student
            and faculty assignments use these records elsewhere in the console.
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

      <div
        role="tablist"
        aria-label="Program sections"
        className="mb-6 flex flex-col gap-2 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-sm sm:flex-row sm:p-1"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={cx(
                "flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition sm:py-3.5",
                active ? "bg-(--brand-navy) text-white shadow-md" : "text-slate-700 hover:bg-slate-50"
              )}
            >
              <span
                className={cx(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  active ? "bg-white/15 text-amber-200" : "bg-slate-100 text-(--brand-blue)"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{t.label}</span>
                <span className={cx("mt-0.5 block text-xs leading-snug", active ? "text-white/80" : "text-slate-500")}>
                  {t.desc}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {tab === "departments" ? (
        <div className="space-y-6">
          <div className={ui.dashTableCard}>
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className={cx(ui.h2, "mb-0")}>Departments</h2>
                <p className="mt-1 text-xs text-slate-500">{loading ? "Loading…" : `${departments.length} total`}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDeptForm({ name: "", code: "", description: "" });
                  setAddDeptOpen(true);
                }}
                className={cx(ui.btnBase, ui.btnPrimary, "shrink-0 self-start sm:self-auto")}
              >
                <Plus className="h-4 w-4" aria-hidden />
                Add department
              </button>
            </div>
            <div className={ui.dashTableScroller}>
              <table className={cx(ui.dashTable, "min-w-[640px]")}>
                <thead>
                  <tr className={ui.dashTableHead}>
                    <th className={ui.dashTableTh}>Name</th>
                    <th className={ui.dashTableTh}>Code</th>
                    <th className={ui.dashTableTh}>Status</th>
                    <th className={ui.dashTableTh}>Description</th>
                    <th className={ui.dashTableTh}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d) => (
                    <tr key={d._id} className={ui.dashTableRow}>
                      <td className={cx(ui.dashTableTd, "font-semibold text-slate-900")}>{d.name}</td>
                      <td className={ui.dashTableTd}>
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{d.code}</code>
                      </td>
                      <td className={ui.dashTableTd}>
                        <StatusBadge active={d.isActive} />
                      </td>
                      <td className={cx(ui.dashTableTd, "max-w-[220px] truncate text-slate-600")} title={d.description}>
                        {d.description || "—"}
                      </td>
                      <td className={ui.dashTableTd}>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            className={cx(ui.btnBase, ui.btnSoft, "px-2.5 py-1.5 text-xs")}
                            onClick={() => setEditDept({ ...d })}
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden />
                            Edit
                          </button>
                          <button
                            type="button"
                            className={cx(ui.btnBase, ui.btnSoft, "px-2.5 py-1.5 text-xs")}
                            disabled={busyId === d._id}
                            onClick={() => toggleDepartment(d._id)}
                          >
                            <Power className="h-3.5 w-3.5" aria-hidden />
                            Toggle
                          </button>
                          <button
                            type="button"
                            className={cx(ui.btnBase, "border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs text-red-800 hover:bg-red-100")}
                            onClick={() => setDeleteTarget({ type: "department", id: d._id, label: d.name })}
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
            {departments.length === 0 && !loading ? (
              <p className="px-5 py-8 text-center text-sm text-slate-500">
                No departments yet. Click <strong>Add department</strong> to create one.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {tab === "courses" ? (
        <div className="space-y-6">
          <div className={ui.dashTableCard}>
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className={cx(ui.h2, "mb-0")}>Courses & programs</h2>
                <p className="mt-1 text-xs text-slate-500">{loading ? "Loading…" : `${courses.length} total`}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCourseForm({
                    courseName: "",
                    courseCode: "",
                    department: "",
                    duration: "",
                    totalSemesters: "6",
                    fees: "0",
                    description: "",
                    eligibility: "",
                  });
                  setAddCourseOpen(true);
                }}
                className={cx(ui.btnBase, ui.btnPrimary, "shrink-0 self-start sm:self-auto")}
              >
                <Plus className="h-4 w-4" aria-hidden />
                Add course program
              </button>
            </div>
            <div className={ui.dashTableScroller}>
              <table className={cx(ui.dashTable, "min-w-[720px]")}>
                <thead>
                  <tr className={ui.dashTableHead}>
                    <th className={ui.dashTableTh}>Program</th>
                    <th className={ui.dashTableTh}>Code</th>
                    <th className={ui.dashTableTh}>Department</th>
                    <th className={ui.dashTableTh}>Duration</th>
                    <th className={ui.dashTableTh}>Semesters</th>
                    <th className={ui.dashTableTh}>Fees</th>
                    <th className={ui.dashTableTh}>Status</th>
                    <th className={ui.dashTableTh}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => {
                    const dep = c.department;
                    const depLabel =
                      dep && typeof dep === "object" ? `${dep.name} (${dep.code})` : deptById.get(String(dep))?.name || "—";
                    return (
                      <tr key={c._id} className={ui.dashTableRow}>
                        <td className={cx(ui.dashTableTd, "font-semibold text-slate-900")}>{c.courseName}</td>
                        <td className={ui.dashTableTd}>
                          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{c.courseCode}</code>
                        </td>
                        <td className={ui.dashTableTd}>{depLabel}</td>
                        <td className={ui.dashTableTd}>{c.duration}</td>
                        <td className={ui.dashTableTd}>{c.totalSemesters}</td>
                        <td className={ui.dashTableTd}>₹{Number(c.fees || 0).toLocaleString("en-IN")}</td>
                        <td className={ui.dashTableTd}>
                          <StatusBadge active={c.isActive} />
                        </td>
                        <td className={ui.dashTableTd}>
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              className={cx(ui.btnBase, ui.btnSoft, "px-2.5 py-1.5 text-xs")}
                              onClick={() =>
                                setEditCourse({
                                  ...c,
                                  department: c.department?._id ? String(c.department._id) : String(c.department || ""),
                                })
                              }
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden />
                              Edit
                            </button>
                            <button
                              type="button"
                              className={cx(ui.btnBase, ui.btnSoft, "px-2.5 py-1.5 text-xs")}
                              disabled={busyId === c._id}
                              onClick={() => toggleCourse(c._id)}
                            >
                              <Power className="h-3.5 w-3.5" aria-hidden />
                              Toggle
                            </button>
                            <button
                              type="button"
                              className={cx(ui.btnBase, "border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs text-red-800 hover:bg-red-100")}
                              onClick={() => setDeleteTarget({ type: "course", id: c._id, label: c.courseName })}
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {courses.length === 0 && !loading ? (
              <p className="px-5 py-8 text-center text-sm text-slate-500">
                No courses yet. Click <strong>Add course program</strong> to create one.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <Modal
        open={addDeptOpen}
        title="Add department"
        onClose={() => setAddDeptOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className={cx(ui.btnBase, ui.btnSoft)} onClick={() => setAddDeptOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="add-dept-form" className={cx(ui.btnBase, ui.btnPrimary)}>
              Create department
            </button>
          </div>
        }
      >
        <p className="mb-4 text-sm text-slate-600">
          Short code is used in reports and integrations (e.g. CSE, LAW). Name and code must be unique.
        </p>
        <form id="add-dept-form" onSubmit={submitDepartment} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Name</label>
            <input
              className={ui.input}
              value={deptForm.name}
              onChange={(e) => setDeptForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="e.g. Computer Science"
              required
            />
          </div>
          <div className="sm:col-span-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Code</label>
            <input
              className={ui.input}
              value={deptForm.code}
              onChange={(e) => setDeptForm((s) => ({ ...s, code: e.target.value }))}
              placeholder="e.g. CS"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description (optional)
            </label>
            <textarea
              className={ui.textarea}
              rows={2}
              value={deptForm.description}
              onChange={(e) => setDeptForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="Mission, campus location, or notes for staff"
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={addCourseOpen}
        title="Add course program"
        onClose={() => setAddCourseOpen(false)}
        maxWidthClassName="max-w-3xl"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className={cx(ui.btnBase, ui.btnSoft)} onClick={() => setAddCourseOpen(false)}>
              Cancel
            </button>
            <button
              type="submit"
              form="add-course-form"
              className={cx(ui.btnBase, ui.btnPrimary)}
              disabled={activeDepartments.length === 0}
            >
              Create course
            </button>
          </div>
        }
      >
        <p className="mb-4 text-sm text-slate-600">
          Each program belongs to one department. Use a unique <strong>course code</strong> (e.g. BCA-2024).
        </p>
        {activeDepartments.length === 0 ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            You need at least one <strong>active</strong> department first. Open the <strong>Departments</strong> tab and
            use <strong>Add department</strong>.
          </p>
        ) : (
          <form id="add-course-form" onSubmit={submitCourse} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Department
              </label>
              <select
                className={ui.select}
                value={courseForm.department}
                onChange={(e) => setCourseForm((s) => ({ ...s, department: e.target.value }))}
                required
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id} disabled={d.isActive === false}>
                    {d.name} ({d.code}){d.isActive === false ? " — inactive" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Program name
              </label>
              <input
                className={ui.input}
                value={courseForm.courseName}
                onChange={(e) => setCourseForm((s) => ({ ...s, courseName: e.target.value }))}
                placeholder="e.g. Bachelor of Computer Applications"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Course code
              </label>
              <input
                className={ui.input}
                value={courseForm.courseCode}
                onChange={(e) => setCourseForm((s) => ({ ...s, courseCode: e.target.value }))}
                placeholder="e.g. BCA"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Duration label
              </label>
              <input
                className={ui.input}
                value={courseForm.duration}
                onChange={(e) => setCourseForm((s) => ({ ...s, duration: e.target.value }))}
                placeholder="e.g. 3 years"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:col-span-2 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Semesters
                </label>
                <input
                  type="number"
                  min={1}
                  className={ui.input}
                  value={courseForm.totalSemesters}
                  onChange={(e) => setCourseForm((s) => ({ ...s, totalSemesters: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Fees (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  className={ui.input}
                  value={courseForm.fees}
                  onChange={(e) => setCourseForm((s) => ({ ...s, fees: e.target.value }))}
                  placeholder="0"
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Eligibility (optional)
              </label>
              <input
                className={ui.input}
                value={courseForm.eligibility}
                onChange={(e) => setCourseForm((s) => ({ ...s, eligibility: e.target.value }))}
                placeholder="e.g. 10+2 with Mathematics"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description (optional)
              </label>
              <textarea
                className={ui.textarea}
                rows={2}
                value={courseForm.description}
                onChange={(e) => setCourseForm((s) => ({ ...s, description: e.target.value }))}
              />
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={Boolean(editDept)}
        title="Edit department"
        onClose={() => setEditDept(null)}
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className={cx(ui.btnBase, ui.btnSoft)} onClick={() => setEditDept(null)}>
              Cancel
            </button>
            <button type="submit" form="edit-dept-form" className={cx(ui.btnBase, ui.btnPrimary)}>
              Save changes
            </button>
          </div>
        }
      >
        {editDept ? (
          <form id="edit-dept-form" onSubmit={saveEditDept} className="grid gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Name</label>
              <input
                className={ui.input}
                value={editDept.name}
                onChange={(e) => setEditDept((s) => ({ ...s, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Code</label>
              <input
                className={ui.input}
                value={editDept.code}
                onChange={(e) => setEditDept((s) => ({ ...s, code: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </label>
              <textarea
                className={ui.textarea}
                rows={2}
                value={editDept.description || ""}
                onChange={(e) => setEditDept((s) => ({ ...s, description: e.target.value }))}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={editDept.isActive !== false}
                onChange={(e) => setEditDept((s) => ({ ...s, isActive: e.target.checked }))}
              />
              Department is active (inactive departments are hidden from new course creation)
            </label>
          </form>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(editCourse)}
        title="Edit course"
        onClose={() => setEditCourse(null)}
        maxWidthClassName="max-w-3xl"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className={cx(ui.btnBase, ui.btnSoft)} onClick={() => setEditCourse(null)}>
              Cancel
            </button>
            <button type="submit" form="edit-course-form" className={cx(ui.btnBase, ui.btnPrimary)}>
              Save changes
            </button>
          </div>
        }
      >
        {editCourse ? (
          <form id="edit-course-form" onSubmit={saveEditCourse} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Department
              </label>
              <select
                className={ui.select}
                value={editCourse.department}
                onChange={(e) => setEditCourse((s) => ({ ...s, department: e.target.value }))}
                required
              >
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Program name
              </label>
              <input
                className={ui.input}
                value={editCourse.courseName}
                onChange={(e) => setEditCourse((s) => ({ ...s, courseName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Course code
              </label>
              <input
                className={ui.input}
                value={editCourse.courseCode}
                onChange={(e) => setEditCourse((s) => ({ ...s, courseCode: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Duration
              </label>
              <input
                className={ui.input}
                value={editCourse.duration}
                onChange={(e) => setEditCourse((s) => ({ ...s, duration: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Semesters
                </label>
                <input
                  type="number"
                  min={1}
                  className={ui.input}
                  value={editCourse.totalSemesters}
                  onChange={(e) => setEditCourse((s) => ({ ...s, totalSemesters: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Fees (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  className={ui.input}
                  value={editCourse.fees}
                  onChange={(e) => setEditCourse((s) => ({ ...s, fees: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Eligibility
              </label>
              <input
                className={ui.input}
                value={editCourse.eligibility || ""}
                onChange={(e) => setEditCourse((s) => ({ ...s, eligibility: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </label>
              <textarea
                className={ui.textarea}
                rows={2}
                value={editCourse.description || ""}
                onChange={(e) => setEditCourse((s) => ({ ...s, description: e.target.value }))}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
              <input
                type="checkbox"
                checked={editCourse.isActive !== false}
                onChange={(e) => setEditCourse((s) => ({ ...s, isActive: e.target.checked }))}
              />
              Course is active
            </label>
          </form>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        title={deleteTarget?.type === "department" ? "Delete department?" : "Delete course?"}
        onClose={() => setDeleteTarget(null)}
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className={cx(ui.btnBase, ui.btnSoft)} onClick={() => setDeleteTarget(null)}>
              Cancel
            </button>
            <button
              type="button"
              className={cx(ui.btnBase, ui.btnDanger)}
              disabled={busyId === deleteTarget?.id}
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        }
      >
        {deleteTarget ? (
          <p className="text-sm text-slate-700">
            This will permanently remove <strong>{deleteTarget.label}</strong>.
            {deleteTarget.type === "department"
              ? " You cannot delete a department that still has courses."
              : " Students linked to this course may need to be reassigned first if the server rejects the delete."}
          </p>
        ) : null}
      </Modal>
    </div>
  );
}
