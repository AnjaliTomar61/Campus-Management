import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/apiClient";
import Modal from "../common/Modal";
import { cx, ui } from "../../lib/ui";

export default function AdminSemesters() {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [courseId, setCourseId] = useState("");

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ course: "", number: 1, title: "" });

  const filtered = useMemo(() => {
    if (!courseId) return semesters;
    return semesters.filter((s) => (s.course?._id || s.course) === courseId);
  }, [semesters, courseId]);

  const load = async () => {
    const [cRes, sRes] = await Promise.all([
      api.get("/api/course/all"),
      api.get("/api/semesters", { params: courseId ? { courseId } : undefined }),
    ]);
    setCourses(cRes.data.courses || []);
    setSemesters(sRes.data.semesters || []);
  };

  useEffect(() => {
    load().catch(console.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    api
      .get("/api/semesters", { params: courseId ? { courseId } : undefined })
      .then((r) => setSemesters(r.data.semesters || []))
      .catch(console.log);
  }, [courseId]);

  const openCreate = () => {
    setEditId(null);
    setForm({ course: courseId || "", number: 1, title: "" });
    setOpen(true);
  };

  const openEdit = (sem) => {
    setEditId(sem._id);
    setForm({
      course: sem.course?._id || sem.course,
      number: sem.number,
      title: sem.title || "",
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
      await api.put(`/api/semesters/${editId}`, form, {
        meta: { successMessage: "Semester updated." },
      });
    } else {
      await api.post("/api/semesters", form, {
        meta: { successMessage: "Semester created." },
      });
    }
    close();
    await load();
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this semester?")) return;
    await api.delete(`/api/semesters/${id}`, {
      meta: { successMessage: "Semester deleted." },
    });
    await load();
  };

  return (
    <div className={cx(ui.page, "p-4 sm:p-6")}>
      <div className={cx(ui.cardHeader, "mb-6")}>
        <div>
          <h1 className={ui.h1}>Semesters</h1>
          <p className="text-sm text-slate-500">
            Manage semester structure for each course.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className={cx(ui.select, "sm:w-72")}
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.courseName} ({c.courseCode})
              </option>
            ))}
          </select>
          <button className={cx(ui.btnBase, ui.btnAccent)} onClick={openCreate}>
            + Add Semester
          </button>
        </div>
      </div>

      <div className={ui.dashTableCard}>
        <div className={ui.dashTableScroller}>
          <table className={cx(ui.dashTable, "min-w-[820px]")}>
            <thead>
              <tr className={ui.dashTableHead}>
                <th className={ui.dashTableTh}>Course</th>
                <th className={ui.dashTableTh}>Number</th>
                <th className={ui.dashTableTh}>Title</th>
                <th className={ui.dashTableTh}>Status</th>
                <th className={ui.dashTableTh}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id} className={ui.dashTableRow}>
                  <td className={ui.dashTableTd}>{s.course?.courseName || "—"}</td>
                  <td className={cx(ui.dashTableTd, "font-semibold")}>{s.number}</td>
                  <td className={ui.dashTableTd}>{s.title || "—"}</td>
                  <td className={ui.dashTableTd}>
                    {s.isActive ? (
                      <span className="font-semibold text-green-700">Active</span>
                    ) : (
                      <span className="font-semibold text-red-600">Inactive</span>
                    )}
                  </td>
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

              {filtered.length === 0 ? (
                <tr>
                  <td className={cx(ui.dashTableTd, "py-8 text-sm text-slate-500")} colSpan={5}>
                    No semesters found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={open}
        title={editId ? "Update Semester" : "Create Semester"}
        onClose={close}
        maxWidthClassName="max-w-xl"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button className={cx(ui.btnBase, ui.btnSoft)} onClick={close}>
              Cancel
            </button>
            <button
              className={cx(ui.btnBase, ui.btnPrimary)}
              type="submit"
              form="semesterForm"
            >
              {editId ? "Save Changes" : "Create Semester"}
            </button>
          </div>
        }
      >
        <form id="semesterForm" onSubmit={onSubmit} className="space-y-4">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Semester Number
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={form.number}
                onChange={(e) =>
                  setForm((p) => ({ ...p, number: Number(e.target.value) }))
                }
                className={ui.input}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Title (optional)
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className={ui.input}
                placeholder="e.g. Semester 1"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

