import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, RefreshCw, Trash2, Eye, EyeOff } from "lucide-react";
import { api } from "../../lib/apiClient";
import Modal from "../common/Modal";
import { cx, ui } from "../../lib/ui";

function emptyLine() {
  return { subject: "", subjectLabel: "", maxMarks: 100, obtained: 0, grade: "" };
}

function emptyForm() {
  return {
    examTitle: "",
    semester: "",
    published: false,
    remarks: "",
    lines: [emptyLine()],
  };
}

function semesterLabel(s) {
  if (!s) return "";
  const c = s.course;
  const cpart = c && typeof c === "object" ? `${c.courseName} (${c.courseCode})` : "";
  return [cpart, `Sem ${s.number}`].filter(Boolean).join(" · ");
}

export default function AdminResultsPanel() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [semesterFilter, setSemesterFilter] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const selectedStudent = useMemo(
    () => students.find((s) => String(s.userId) === String(studentId)),
    [students, studentId]
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/v1/user/admin/students-academic");
        setStudents(res.data?.students || []);
      } catch {
        setStudents([]);
      }
    })();
  }, []);

  const loadSemestersForStudent = useCallback(async () => {
    const courseId = selectedStudent?.profile?.course?._id || selectedStudent?.profile?.course;
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
  }, [selectedStudent]);

  useEffect(() => {
    setSemesterFilter("");
    setResults([]);
    loadSemestersForStudent();
  }, [studentId, loadSemestersForStudent]);

  const loadSubjects = useCallback(async (semId) => {
    if (!semId) {
      setSubjects([]);
      return;
    }
    try {
      const res = await api.get("/api/subjects", { params: { semesterId: semId } });
      setSubjects(res.data?.subjects || []);
    } catch {
      setSubjects([]);
    }
  }, []);

  useEffect(() => {
    loadSubjects(form.semester);
  }, [form.semester, loadSubjects]);

  const loadResults = useCallback(async () => {
    if (!studentId) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const params = { studentId };
      if (semesterFilter) params.semesterId = semesterFilter;
      const res = await api.get("/api/results/admin", { params });
      setResults(res.data?.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [studentId, semesterFilter]);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const openCreate = () => {
    setEditingId(null);
    const defSem =
      semesterFilter ||
      selectedStudent?.profile?.currentSemester?._id ||
      selectedStudent?.profile?.currentSemester ||
      "";
    setForm({ ...emptyForm(), semester: defSem ? String(defSem) : "" });
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row._id);
    setForm({
      examTitle: row.examTitle || "",
      semester: row.semester?._id || row.semester || "",
      published: Boolean(row.published),
      remarks: row.remarks || "",
      lines:
        Array.isArray(row.lines) && row.lines.length
          ? row.lines.map((l) => ({
              subject: l.subject?._id || l.subject || "",
              subjectLabel: l.subjectLabel || "",
              maxMarks: l.maxMarks ?? 100,
              obtained: l.obtained ?? 0,
              grade: l.grade || "",
            }))
          : [emptyLine()],
    });
    setModalOpen(true);
  };

  const saveResult = async () => {
    if (!studentId || !form.semester || !String(form.examTitle || "").trim()) return;
    setSaving(true);
    try {
      const lines = (form.lines || []).map((l) => ({
        subject: l.subject || null,
        subjectLabel: l.subjectLabel || "",
        maxMarks: Number(l.maxMarks) || 0,
        obtained: Number(l.obtained) || 0,
        grade: l.grade || "",
      }));
      const body = {
        student: studentId,
        semester: form.semester,
        examTitle: String(form.examTitle).trim(),
        published: form.published,
        remarks: form.remarks || "",
        lines,
      };
      if (editingId) {
        await api.put(`/api/results/admin/${editingId}`, body, { meta: { successMessage: "Result updated" } });
      } else {
        await api.post("/api/results/admin", body, { meta: { successMessage: "Result created" } });
      }
      setModalOpen(false);
      await loadResults();
    } catch {
      /* */
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (row) => {
    try {
      await api.put(
        `/api/results/admin/${row._id}`,
        { published: !row.published },
        { meta: { successMessage: !row.published ? "Published" : "Unpublished" } }
      );
      await loadResults();
    } catch {
      /* */
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/results/admin/${deleteId}`, { meta: { successMessage: "Deleted" } });
      setDeleteId(null);
      await loadResults();
    } catch {
      /* */
    }
  };

  const addLine = () => setForm((f) => ({ ...f, lines: [...(f.lines || []), emptyLine()] }));
  const removeLine = (idx) =>
    setForm((f) => ({
      ...f,
      lines: (f.lines || []).filter((_, i) => i !== idx),
    }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className={ui.h1}>Results</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Enter marks per subject for an exam session, then publish when ready. Students only see published records;
          assigned faculty can review mentees’ published results.
        </p>
      </div>

      <div className={cx(ui.card, "flex flex-col gap-4 p-5 lg:flex-row lg:flex-wrap lg:items-end")}>
        <div className="min-w-[14rem] flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Student</label>
          <select
            className={ui.select}
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.userId} value={s.userId}>
                {s.name} — {s.email}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[12rem] flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Filter semester
          </label>
          <select
            className={ui.select}
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            disabled={!studentId || !semesters.length}
          >
            <option value="">All semesters</option>
            {semesters.map((sem) => (
              <option key={sem._id} value={sem._id}>
                Semester {sem.number}
                {sem.title ? ` — ${sem.title}` : ""}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className={cx(ui.btnBase, ui.btnSoft)} disabled={!studentId} onClick={() => loadResults()}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
        <button type="button" className={cx(ui.btnBase, ui.btnPrimary)} disabled={!studentId} onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New result sheet
        </button>
      </div>

      {!studentId ? (
        <p className="text-sm text-slate-500">Select a student to view or add result sheets.</p>
      ) : (
        <div className={ui.dashTableCard}>
          <div className={ui.dashTableScroller}>
            <table className={ui.dashTable}>
              <thead className={ui.dashTableHead}>
                <tr>
                  <th className={ui.dashTableTh}>Exam</th>
                  <th className={ui.dashTableTh}>Semester</th>
                  <th className={ui.dashTableTh}>Lines</th>
                  <th className={ui.dashTableTh}>Status</th>
                  <th className={ui.dashTableTh} />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className={cx(ui.dashTableTd, "py-10 text-center text-slate-500")}>
                      Loading…
                    </td>
                  </tr>
                ) : results.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={cx(ui.dashTableTd, "py-10 text-center text-slate-500")}>
                      No records yet. Create one for mid-term, end-semester, etc.
                    </td>
                  </tr>
                ) : (
                  results.map((r) => (
                    <tr key={r._id} className={ui.dashTableRow}>
                      <td className={ui.dashTableTd}>
                        <span className="font-semibold text-slate-900">{r.examTitle}</span>
                      </td>
                      <td className={cx(ui.dashTableTd, "text-sm text-slate-600")}>{semesterLabel(r.semester)}</td>
                      <td className={ui.dashTableTd}>{(r.lines || []).length}</td>
                      <td className={ui.dashTableTd}>
                        <span
                          className={cx(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            r.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                          )}
                        >
                          {r.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className={cx(ui.dashTableTd, "whitespace-nowrap text-right")}>
                        <button
                          type="button"
                          className="mr-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                          title={r.published ? "Unpublish" : "Publish"}
                          onClick={() => togglePublish(r)}
                        >
                          {r.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          className="mr-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                          aria-label="Edit"
                          onClick={() => openEdit(r)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          aria-label="Delete"
                          onClick={() => setDeleteId(r._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit result sheet" : "New result sheet"}
        maxWidthClassName="max-w-3xl"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className={cx(ui.btnBase, ui.btnSoft)} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className={cx(ui.btnBase, ui.btnPrimary)}
              disabled={saving || !form.semester || !String(form.examTitle || "").trim()}
              onClick={saveResult}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        }
      >
        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Semester</label>
            <select
              className={ui.select}
              value={form.semester}
              onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))}
            >
              <option value="">Select semester</option>
              {semesters.map((sem) => (
                <option key={sem._id} value={sem._id}>
                  Semester {sem.number}
                  {sem.title ? ` — ${sem.title}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Exam / session title</label>
            <input
              className={ui.input}
              value={form.examTitle}
              onChange={(e) => setForm((f) => ({ ...f, examTitle: e.target.value }))}
              placeholder="e.g. End Semester Examination 2026"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            />
            Published (visible to student and mentor)
          </label>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Remarks</label>
            <input
              className={ui.input}
              value={form.remarks}
              onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
              placeholder="Optional note on performance"
            />
          </div>
          <div className="border-t border-slate-100 pt-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">Subject lines</span>
              <button type="button" className={cx(ui.btnBase, ui.btnSoft, "py-1.5 text-xs")} onClick={addLine}>
                + Add line
              </button>
            </div>
            <div className="space-y-3">
              {(form.lines || []).map((line, idx) => (
                <div key={idx} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-3 sm:grid-cols-12">
                  <div className="sm:col-span-4">
                    <label className="mb-0.5 block text-[10px] font-semibold uppercase text-slate-500">Subject</label>
                    <select
                      className={ui.select}
                      value={line.subject}
                      onChange={(e) => setForm((f) => {
                        const lines = [...(f.lines || [])];
                        lines[idx] = { ...lines[idx], subject: e.target.value };
                        return { ...f, lines };
                      })}
                    >
                      <option value="">Custom label only</option>
                      {subjects.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.code} — {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="mb-0.5 block text-[10px] font-semibold uppercase text-slate-500">Label</label>
                    <input
                      className={ui.input}
                      placeholder="If no catalog subject"
                      value={line.subjectLabel}
                      onChange={(e) => setForm((f) => {
                        const lines = [...(f.lines || [])];
                        lines[idx] = { ...lines[idx], subjectLabel: e.target.value };
                        return { ...f, lines };
                      })}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="mb-0.5 block text-[10px] font-semibold uppercase text-slate-500">Max</label>
                    <input
                      type="number"
                      className={ui.input}
                      value={line.maxMarks}
                      onChange={(e) => setForm((f) => {
                        const lines = [...(f.lines || [])];
                        lines[idx] = { ...lines[idx], maxMarks: e.target.value };
                        return { ...f, lines };
                      })}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="mb-0.5 block text-[10px] font-semibold uppercase text-slate-500">Got</label>
                    <input
                      type="number"
                      className={ui.input}
                      value={line.obtained}
                      onChange={(e) => setForm((f) => {
                        const lines = [...(f.lines || [])];
                        lines[idx] = { ...lines[idx], obtained: e.target.value };
                        return { ...f, lines };
                      })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-0.5 block text-[10px] font-semibold uppercase text-slate-500">Grade</label>
                    <input
                      className={ui.input}
                      value={line.grade}
                      onChange={(e) => setForm((f) => {
                        const lines = [...(f.lines || [])];
                        lines[idx] = { ...lines[idx], grade: e.target.value };
                        return { ...f, lines };
                      })}
                    />
                  </div>
                  <div className="flex items-end sm:col-span-1">
                    <button
                      type="button"
                      className={cx(ui.btnBase, ui.btnSoft, "w-full py-2 text-xs")}
                      disabled={(form.lines || []).length <= 1}
                      onClick={() => removeLine(idx)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete result sheet?"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className={cx(ui.btnBase, ui.btnSoft)} onClick={() => setDeleteId(null)}>
              Cancel
            </button>
            <button type="button" className={cx(ui.btnBase, ui.btnDanger)} onClick={confirmDelete}>
              Delete
            </button>
          </div>
        }
      >
        <p className="p-5 text-sm text-slate-600">This cannot be undone.</p>
      </Modal>
    </div>
  );
}
