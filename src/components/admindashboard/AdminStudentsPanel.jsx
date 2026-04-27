import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { api } from "../../lib/apiClient";
import Modal from "../common/Modal";
import { cx, ui } from "../../lib/ui";

function emptyForm() {
  return {
    enrollmentNo: "",
    department: "",
    course: "",
    currentSemester: "",
    admissionStatus: "pending",
    assignedFaculty: "",
  };
}

/** Students: roster (name, email, enrollment) + full academic edit in modal */
export default function AdminStudentsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const loadSemesters = useCallback(async (courseId) => {
    if (!courseId) {
      setSemesters([]);
      return;
    }
    try {
      const res = await api.get("/api/semesters/", { params: { courseId } });
      setSemesters(res.data?.semesters || []);
    } catch {
      setSemesters([]);
    }
  }, []);

  const refresh = useCallback(async () => {
    const [stRes, depRes, cRes, usersRes] = await Promise.all([
      api.get("/api/v1/user/admin/students-academic"),
      api.get("/api/department/all").catch(() => ({ data: {} })),
      api.get("/api/course/all").catch(() => ({ data: {} })),
      api.get("/api/v1/user/getalluser").catch(() => ({ data: [] })),
    ]);
    setRows(stRes.data?.students || []);
    setDepartments((depRes.data?.departments || []).filter((d) => d.isActive !== false));
    setCourses((cRes.data?.courses || []).filter((c) => c.isActive !== false));
    const all = usersRes.data?.data || [];
    setFacultyOptions(all.filter((u) => u.role === "faculty"));
  }, []);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        await refresh();
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, [refresh]);

  useEffect(() => {
    if (!form.course) {
      setSemesters([]);
      return;
    }
    loadSemesters(form.course);
  }, [form.course, loadSemesters]);

  const filteredCourses = !form.department
    ? courses
    : courses.filter((co) => {
        const dep = co.department;
        const id = dep && typeof dep === "object" ? dep._id : dep;
        return id && String(id) === String(form.department);
      });

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => {
      const p = row.profile || {};
      const enr = (p.enrollmentNo || "").toLowerCase();
      return (
        row.name?.toLowerCase().includes(q) ||
        row.email?.toLowerCase().includes(q) ||
        enr.includes(q)
      );
    });
  }, [rows, query]);

  const openEdit = (row) => {
    setSelected(row);
    const p = row.profile || {};
    const courseId = p.course?._id ? String(p.course._id) : p.course ? String(p.course) : "";
    setForm({
      enrollmentNo: p.enrollmentNo ?? "",
      department: p.department?._id ? String(p.department._id) : p.department ? String(p.department) : "",
      course: courseId,
      currentSemester: p.currentSemester?._id
        ? String(p.currentSemester._id)
        : p.currentSemester
          ? String(p.currentSemester)
          : "",
      admissionStatus: p.admissionStatus || "pending",
      assignedFaculty: p.assignedFaculty?._id
        ? String(p.assignedFaculty._id)
        : p.assignedFaculty
          ? String(p.assignedFaculty)
          : "",
    });
    if (courseId) loadSemesters(courseId);
  };

  const closeModal = () => {
    setSelected(null);
    setForm(emptyForm());
  };

  const save = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await api.put(
        `/api/v1/user/admin/students/${selected.userId}/academic`,
        {
          enrollmentNo: form.enrollmentNo.trim(),
          department: form.department || null,
          course: form.course || null,
          currentSemester: form.currentSemester || null,
          admissionStatus: form.admissionStatus,
          assignedFaculty: form.assignedFaculty || null,
        },
        { meta: { successMessage: "Student record saved" } }
      );
      await refresh();
      closeModal();
    } catch {
      //
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={cx("flex min-h-[40vh] items-center justify-center p-8", ui.page)}>
        <p className="text-sm font-medium text-slate-600">Loading students…</p>
      </div>
    );
  }

  return (
    <div className={cx("p-4 sm:p-6 lg:p-8", ui.page)}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className={cx(ui.h1, "tracking-tight")}>Students</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
            Roster with name, email, and enrollment. Use <span className="font-medium text-slate-800">Manage</span> to
            set department, course, semester, admission, and assigned faculty mentor.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search name, email, enrollment…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cx(ui.input, "pl-9")}
              aria-label="Search students"
            />
          </div>
          <button
            type="button"
            onClick={() => refresh()}
            className={cx(ui.btnBase, ui.btnSoft, "shrink-0 gap-2 px-4")}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className={cx(ui.dashTableCard, "shadow-md")}>
        <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {filteredRows.length} student{filteredRows.length === 1 ? "" : "s"}
            {query ? " (filtered)" : ""}
          </p>
        </div>
        <div className={ui.dashTableScroller}>
          <table className={cx(ui.dashTable, "min-w-[640px]")}>
            <thead>
              <tr className={ui.dashTableHead}>
                <th className={ui.dashTableTh}>Name</th>
                <th className={ui.dashTableTh}>Email</th>
                <th className={ui.dashTableTh}>Enrollment no.</th>
                <th className={ui.dashTableTh} />
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const p = row.profile || {};
                return (
                  <tr key={row.userId} className={ui.dashTableRow}>
                    <td className={cx(ui.dashTableTd, "font-semibold text-slate-900")}>{row.name}</td>
                    <td className={cx(ui.dashTableTd, "text-slate-600")}>{row.email}</td>
                    <td className={cx(ui.dashTableTd, "font-mono text-sm text-slate-800")}>
                      {p.enrollmentNo || (
                        <span className="font-sans font-normal text-slate-400">—</span>
                      )}
                    </td>
                    <td className={ui.dashTableTd}>
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className={cx(ui.btnBase, ui.btnPrimary, "px-4 py-2 text-sm")}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={Boolean(selected)}
        title={selected ? `Student record — ${selected.name}` : ""}
        onClose={closeModal}
        maxWidthClassName="max-w-lg"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={closeModal} className={cx(ui.btnBase, ui.btnSoft)}>
              Cancel
            </button>
            <button
              type="submit"
              form="admin-student-record-form"
              disabled={saving}
              className={cx(ui.btnBase, ui.btnPrimary)}
            >
              {saving ? "Saving…" : "Save record"}
            </button>
          </div>
        }
      >
        {selected ? (
          <form id="admin-student-record-form" onSubmit={save} className="grid gap-4 p-1">
            <ModalField label="Enrollment number">
              <input
                className={ui.input}
                value={form.enrollmentNo}
                onChange={(e) => setForm((f) => ({ ...f, enrollmentNo: e.target.value }))}
              />
            </ModalField>
            <ModalField label="Department">
              <select
                className={ui.select}
                value={form.department}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    department: e.target.value,
                    course: "",
                    currentSemester: "",
                  }))
                }
              >
                <option value="">—</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </ModalField>
            <ModalField label="Course">
              <select
                className={ui.select}
                value={form.course}
                onChange={(e) => setForm((f) => ({ ...f, course: e.target.value, currentSemester: "" }))}
              >
                <option value="">—</option>
                {filteredCourses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.courseName} ({c.courseCode})
                  </option>
                ))}
              </select>
            </ModalField>
            <ModalField label="Current semester">
              <select
                className={ui.select}
                value={form.currentSemester}
                onChange={(e) => setForm((f) => ({ ...f, currentSemester: e.target.value }))}
                disabled={!form.course}
              >
                <option value="">—</option>
                {semesters.map((s) => (
                  <option key={s._id} value={s._id}>
                    Sem {s.number}
                    {s.title ? ` — ${s.title}` : ""}
                  </option>
                ))}
              </select>
            </ModalField>
            <ModalField label="Admission status">
              <select
                className={ui.select}
                value={form.admissionStatus}
                onChange={(e) => setForm((f) => ({ ...f, admissionStatus: e.target.value }))}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </ModalField>
            <ModalField label="Assigned faculty (mentor)">
              <select
                className={ui.select}
                value={form.assignedFaculty}
                onChange={(e) => setForm((f) => ({ ...f, assignedFaculty: e.target.value }))}
              >
                <option value="">— None —</option>
                {facultyOptions.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} ({f.email})
                  </option>
                ))}
              </select>
            </ModalField>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}

function ModalField({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
    </div>
  );
}
