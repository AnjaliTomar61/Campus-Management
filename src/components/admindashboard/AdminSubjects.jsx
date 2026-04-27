import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/apiClient";
import Modal from "../common/Modal";
import { cx, ui } from "../../lib/ui";

export default function AdminSubjects() {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

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
  });

  const semesterOptions = useMemo(() => {
    if (!courseId) return semesters;
    return semesters.filter((s) => (s.course?._id || s.course) === courseId);
  }, [semesters, courseId]);

  const loadCourses = async () => {
    const res = await api.get("/api/course/all");
    setCourses(res.data.courses || []);
  };

  const loadSemesters = async () => {
    const res = await api.get("/api/semesters", {
      params: courseId ? { courseId } : undefined,
    });
    setSemesters(res.data.semesters || []);
  };

  const loadSubjects = async () => {
    const res = await api.get("/api/subjects", {
      params: {
        ...(courseId ? { courseId } : {}),
        ...(semesterId ? { semesterId } : {}),
      },
    });
    setSubjects(res.data.subjects || []);
  };

  useEffect(() => {
    Promise.all([loadCourses(), loadSemesters(), loadSubjects()]).catch(console.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadSemesters().catch(console.log);
    setSemesterId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    loadSubjects().catch(console.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, semesterId]);

  const openCreate = () => {
    setEditId(null);
    setForm({
      course: courseId || "",
      semester: semesterId || "",
      code: "",
      name: "",
      credits: 0,
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
    });
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/api/subjects/${editId}`, form, {
        meta: { successMessage: "Subject updated." },
      });
    } else {
      await api.post("/api/subjects", form, {
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
    <div className={cx(ui.page, "p-4 sm:p-6")}>
      <div className={cx(ui.cardHeader, "mb-6")}>
        <div>
          <h1 className={ui.h1}>Subjects</h1>
          <p className="text-sm text-slate-500">
            Create subjects and map them to course + semester.
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className={cx(ui.select, "lg:w-72")}
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.courseName} ({c.courseCode})
              </option>
            ))}
          </select>

          <select
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            className={cx(ui.select, "lg:w-64")}
            disabled={!courseId}
          >
            <option value="">All Semesters</option>
            {semesterOptions.map((s) => (
              <option key={s._id} value={s._id}>
                Sem {s.number} {s.title ? `- ${s.title}` : ""}
              </option>
            ))}
          </select>

          <button className={cx(ui.btnBase, ui.btnAccent)} onClick={openCreate}>
            + Add Subject
          </button>
        </div>
      </div>

      <div className={ui.dashTableCard}>
        <div className={ui.dashTableScroller}>
          <table className={cx(ui.dashTable, "min-w-[980px]")}>
            <thead>
              <tr className={ui.dashTableHead}>
                <th className={ui.dashTableTh}>Code</th>
                <th className={ui.dashTableTh}>Name</th>
                <th className={ui.dashTableTh}>Credits</th>
                <th className={ui.dashTableTh}>Semester</th>
                <th className={ui.dashTableTh}>Course</th>
                <th className={ui.dashTableTh}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s._id} className={ui.dashTableRow}>
                  <td className={cx(ui.dashTableTd, "font-semibold")}>{s.code}</td>
                  <td className={ui.dashTableTd}>{s.name}</td>
                  <td className={ui.dashTableTd}>{s.credits ?? 0}</td>
                  <td className={ui.dashTableTd}>{s.semester || "—"}</td>
                  <td className={ui.dashTableTd}>{s.course || "—"}</td>
                  <td className={ui.dashTableTd}>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={cx(ui.btnBase, ui.btnSoft, "px-3 py-1.5")}
                        onClick={() => openEdit(s)}
                      >
                        Edit
                      </button>
                      <button
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
                  <td className={cx(ui.dashTableTd, "py-8 text-sm text-slate-500")} colSpan={6}>
                    No subjects found.
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

