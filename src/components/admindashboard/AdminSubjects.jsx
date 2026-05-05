import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { api } from "../../lib/apiClient";
import Modal from "../common/Modal";
import { cx, ui } from "../../lib/ui";

function courseLabel(c) {
  if (!c) return "—";
  const obj = typeof c === "object" ? c : null;
  if (!obj) return "—";
  const dep = obj.department;
  const depPart = dep && typeof dep === "object" ? ` · ${dep.name}` : "";
  return `${obj.courseName} (${obj.courseCode})${depPart}`;
}

function semesterLabel(s) {
  if (!s || typeof s !== "object") return "—";
  const n = s.number != null ? `Sem ${s.number}` : "Sem";
  return s.title ? `${n} — ${s.title}` : n;
}

export default function AdminSubjects() {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [courseId, setCourseId] = useState("");
  const [semesterId, setSemesterId] = useState("");

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    course: "",
    semester: "",
    code: "",
    name: "",
    credits: 0,
    faculty: "",
  });

  const semesterOptions = useMemo(() => {
    if (!courseId) return semesters;
    return semesters.filter((s) => (s.course?._id || s.course) === courseId);
  }, [semesters, courseId]);

  const loadCourses = useCallback(async () => {
    const res = await api.get("/api/course/all");
    setCourses((res.data?.courses || []).filter((c) => c.isActive !== false));
  }, []);

  const loadFaculty = useCallback(async () => {
    const res = await api.get("/api/v1/user/getalluser");
    const all = res.data?.data || [];
    setFacultyOptions(all.filter((u) => u.role === "faculty"));
  }, []);

  const loadSemesters = useCallback(async () => {
    const res = await api.get("/api/semesters", {
      params: courseId ? { courseId } : undefined,
    });
    setSemesters(res.data?.semesters || []);
  }, [courseId]);

  const loadSubjects = useCallback(async () => {
    const res = await api.get("/api/subjects", {
      params: {
        ...(courseId ? { courseId } : {}),
        ...(semesterId ? { semesterId } : {}),
      },
      meta: { silent: true },
    });
    setSubjects(res.data?.subjects || []);
  }, [courseId, semesterId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await Promise.all([loadCourses(), loadFaculty()]);
        await loadSemesters();
        await loadSubjects();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    loadSemesters().catch(() => {});
    setSemesterId("");
  }, [courseId]);

  useEffect(() => {
    loadSubjects().catch(() => {});
  }, [courseId, semesterId, loadSubjects]);

  const openCreate = () => {
    setEditId(null);
    setForm({
      course: courseId || "",
      semester: semesterId || "",
      code: "",
      name: "",
      credits: 0,
      faculty: "",
    });
    setOpen(true);
  };

  const openEdit = (s) => {
    setEditId(s._id);
    setForm({
      course: s.course?._id || s.course,
      semester: s.semester?._id || s.semester,
      code: s.code,
      name: s.name,
      credits: s.credits ?? 0,
      faculty: s.faculty?._id || s.faculty || "",
    });
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      code: String(form.code || "").trim(),
      name: String(form.name || "").trim(),
      credits: Number(form.credits) || 0,
      faculty: form.faculty || null,
    };
    if (editId) {
      await api.put(`/api/subjects/${editId}`, payload, {
        meta: { successMessage: "Subject updated." },
      });
    } else {
      await api.post("/api/subjects", payload, {
        meta: { successMessage: "Subject created." },
      });
    }
    close();
    await loadSubjects();
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    await api.delete(`/api/subjects/${id}`, {
      meta: { successMessage: "Subject deleted." },
    });
    await loadSubjects();
  };

  return (
    <div className={cx("p-4 sm:p-6 lg:p-8", ui.page)}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className={cx(ui.h1, "tracking-tight")}>Subjects</h1>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
            Create subjects under a course + semester, and optionally assign a faculty member. Timetable slots and
            result sheets use these subjects.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadSubjects()}
          disabled={loading}
          className={cx(ui.btnBase, ui.btnSoft, "shrink-0 self-start sm:self-auto")}
        >
          <RefreshCw className={cx("h-4 w-4", loading && "animate-spin")} aria-hidden />
          Refresh
        </button>
      </div>

      <div className={cx(ui.card, "mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between")}>
        <div className="min-w-0 flex-1">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Course</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className={cx(ui.select, "max-w-md")}
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.courseName} ({c.courseCode})
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0 flex-1">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Semester</label>
          <select
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            className={cx(ui.select, "max-w-md")}
            disabled={!courseId}
          >
            <option value="">All Semesters</option>
            {semesterOptions.map((s) => (
              <option key={s._id} value={s._id}>
                Sem {s.number} {s.title ? `- ${s.title}` : ""}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className={cx(ui.btnBase, ui.btnPrimary, "shrink-0")} onClick={openCreate}>
          <Plus className="h-4 w-4" aria-hidden />
          Add subject
        </button>
      </div>

      <div className={ui.dashTableCard}>
        <div className={ui.dashTableScroller}>
          <table className={cx(ui.dashTable, "min-w-[1100px]")}>
            <thead>
              <tr className={ui.dashTableHead}>
                <th className={ui.dashTableTh}>Code</th>
                <th className={ui.dashTableTh}>Name</th>
                <th className={ui.dashTableTh}>Credits</th>
                <th className={ui.dashTableTh}>Semester</th>
                <th className={ui.dashTableTh}>Course</th>
                <th className={ui.dashTableTh}>Faculty</th>
                <th className={ui.dashTableTh}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s._id} className={ui.dashTableRow}>
                  <td className={cx(ui.dashTableTd, "font-semibold")}>{s.code}</td>
                  <td className={ui.dashTableTd}>{s.name}</td>
                  <td className={ui.dashTableTd}>{s.credits ?? 0}</td>
                  <td className={ui.dashTableTd}>{semesterLabel(s.semester)}</td>
                  <td className={ui.dashTableTd}>{courseLabel(s.course)}</td>
                  <td className={ui.dashTableTd}>{s.faculty?.name || "—"}</td>
                  <td className={ui.dashTableTd}>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className={cx(ui.btnBase, ui.btnSoft, "px-3 py-1.5")} onClick={() => openEdit(s)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className={cx(ui.btnBase, ui.btnDanger, "px-3 py-1.5")}
                        onClick={() => onDelete(s._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {subjects.length === 0 ? (
                <tr>
                  <td className={cx(ui.dashTableTd, "py-10 text-center text-sm text-slate-500")} colSpan={7}>
                    {loading ? "Loading…" : "No subjects found."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={open}
        title={editId ? "Update Subject" : "Create Subject"}
        onClose={close}
        maxWidthClassName="max-w-2xl"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button className={cx(ui.btnBase, ui.btnSoft)} onClick={close}>
              Cancel
            </button>
            <button
              className={cx(ui.btnBase, ui.btnPrimary)}
              type="submit"
              form="subjectForm"
            >
              {editId ? "Save Changes" : "Create Subject"}
            </button>
          </div>
        }
      >
        <form id="subjectForm" onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Course
              </label>
              <select
                value={form.course}
                onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))}
                className={ui.select}
                required
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.courseName} ({c.courseCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Semester
              </label>
              <select
                value={form.semester}
                onChange={(e) =>
                  setForm((p) => ({ ...p, semester: e.target.value }))
                }
                className={ui.select}
                required
              >
                <option value="">Select Semester</option>
                {semesterOptions.map((s) => (
                  <option key={s._id} value={s._id}>
                    Sem {s.number} {s.title ? `- ${s.title}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Subject Code
              </label>
              <input
                value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                className={ui.input}
                placeholder="e.g. DS101"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Credits
              </label>
              <input
                type="number"
                min={0}
                value={form.credits}
                onChange={(e) =>
                  setForm((p) => ({ ...p, credits: Number(e.target.value) }))
                }
                className={ui.input}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Faculty (optional)</label>
            <select
              value={form.faculty}
              onChange={(e) => setForm((p) => ({ ...p, faculty: e.target.value }))}
              className={ui.select}
            >
              <option value="">Unassigned</option>
              {facultyOptions.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} — {f.email}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Assigning faculty makes their timetable automatically show these subjects’ periods.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Subject Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className={ui.input}
              placeholder="e.g. Data Structures"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

