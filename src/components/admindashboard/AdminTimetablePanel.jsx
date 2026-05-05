import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { api } from "../../lib/apiClient";
import Modal from "../common/Modal";
import { cx, ui } from "../../lib/ui";

const DAYS = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
];

const DAY_SHORT = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

function emptySlotForm() {
  return { day: "mon", startTime: "09:00", endTime: "10:00", room: "", subject: "", note: "" };
}

/** Backend expects /^\\d{2}:\\d{2}$/; browsers may send H:mm or HH:mm:ss. */
function toHHmm(raw) {
  if (raw == null || raw === "") return "09:00";
  const s = String(raw).trim();
  const m = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?/);
  if (!m) return "09:00";
  const h = Math.max(0, Math.min(23, parseInt(m[1], 10)));
  const min = Math.max(0, Math.min(59, parseInt(m[2], 10)));
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export default function AdminTimetablePanel() {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptySlotForm());
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [subjectsLoadError, setSubjectsLoadError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/course/all");
        const courses =
          res?.data?.courses ||
          res?.data?.data?.courses ||
          res?.data?.data ||
          [];
        setCourses((Array.isArray(courses) ? courses : []).filter((c) => c?.isActive !== false));
      } catch {
        setCourses([]);
      }
    })();
  }, []);

  const loadSemesters = useCallback(async (cid) => {
    if (!cid) {
      setSemesters([]);
      return;
    }
    try {
      const res = await api.get("/api/semesters/", { params: { courseId: cid } });
      setSemesters(res.data?.semesters || []);
    } catch {
      setSemesters([]);
    }
  }, []);

  useEffect(() => {
    loadSemesters(courseId);
    setSemesterId("");
    setSlots([]);
    setSubjects([]);
  }, [courseId, loadSemesters]);

  const loadSubjects = useCallback(async (sid) => {
    if (!sid) {
      setSubjects([]);
      setSubjectsLoadError("");
      return;
    }
    try {
      const res = await api.get("/api/subjects", { params: { semesterId: sid } });
      setSubjects(res.data?.subjects || []);
      setSubjectsLoadError("");
    } catch {
      setSubjects([]);
      setSubjectsLoadError("Could not load subjects for this semester.");
    }
  }, []);

  const loadSlots = useCallback(async (sid) => {
    if (!sid) {
      setSlots([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/api/timetable", { params: { semesterId: sid } });
      setSlots(res.data?.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects(semesterId);
    loadSlots(semesterId);
  }, [semesterId, loadSubjects, loadSlots]);

  const sortedSlots = useMemo(() => {
    const order = DAYS.map((d) => d.value);
    return [...slots].sort((a, b) => {
      const ia = order.indexOf(String(a.day || "").toLowerCase());
      const ib = order.indexOf(String(b.day || "").toLowerCase());
      if (ia !== ib) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      return String(a.startTime).localeCompare(String(b.startTime));
    });
  }, [slots]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptySlotForm());
    if (semesterId) loadSubjects(semesterId);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      day: String(row.day || "mon").toLowerCase(),
      startTime: toHHmm(row.startTime || "09:00"),
      endTime: toHHmm(row.endTime || "10:00"),
      room: row.room || "",
      subject: row.subject?._id || row.subject || "",
      note: row.note || "",
    });
    if (semesterId) loadSubjects(semesterId);
    setModalOpen(true);
  };

  const saveSlot = async () => {
    if (!semesterId || !form.subject) return;
    setSaving(true);
    try {
      const body = {
        semester: semesterId,
        subject: form.subject,
        day: form.day,
        startTime: toHHmm(form.startTime),
        endTime: toHHmm(form.endTime),
        room: form.room,
        note: form.note,
      };
      if (editing?._id) {
        await api.put(`/api/timetable/${editing._id}`, body, { meta: { successMessage: "Slot updated" } });
      } else {
        await api.post("/api/timetable", body, { meta: { successMessage: "Slot added" } });
      }
      setModalOpen(false);
      await loadSlots(semesterId);
    } catch {
      // toast from api client
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/timetable/${deleteId}`, { meta: { successMessage: "Slot removed" } });
      setDeleteId(null);
      await loadSlots(semesterId);
    } catch {
      /* */
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className={ui.h1}>Timetable</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Build the official weekly grid per semester. Students see the schedule for the semester on their profile;
          faculty see only the periods for subjects assigned to them.
        </p>
      </div>

      <div className={cx(ui.card, "flex flex-col gap-4 p-5 sm:flex-row sm:flex-wrap sm:items-end")}>
        <div className="min-w-48 flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Course</label>
          <select
            className={ui.select}
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.courseName} ({c.courseCode})
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-48 flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Semester</label>
          <select
            className={ui.select}
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            disabled={!courseId}
          >
            <option value="">Select semester</option>
            {semesters.map((s) => (
              <option key={s._id} value={s._id}>
                Semester {s.number}
                {s.title ? ` — ${s.title}` : ""}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className={cx(ui.btnBase, ui.btnSoft)}
          disabled={!semesterId}
          onClick={() => loadSlots(semesterId)}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
        <button
          type="button"
          className={cx(ui.btnBase, ui.btnPrimary)}
          disabled={!semesterId}
          onClick={openCreate}
        >
          <Plus className="h-4 w-4" />
          Add slot
        </button>
      </div>

      {semesterId && subjects.length === 0 && !subjectsLoadError ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          No subjects are defined for this semester yet. Add them under <strong>Subjects</strong> for this course and
          semester, then you can attach timetable slots to them.
        </p>
      ) : null}

      {subjectsLoadError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{subjectsLoadError}</p>
      ) : null}

      {!semesterId ? (
        <p className="text-sm text-slate-500">Choose a course and semester to manage slots.</p>
      ) : (
        <div className={ui.dashTableCard}>
          <div className={ui.dashTableScroller}>
            <table className={ui.dashTable}>
              <thead className={ui.dashTableHead}>
                <tr>
                  <th className={ui.dashTableTh}>Day</th>
                  <th className={ui.dashTableTh}>Time</th>
                  <th className={ui.dashTableTh}>Subject</th>
                  <th className={ui.dashTableTh}>Faculty</th>
                  <th className={ui.dashTableTh}>Room</th>
                  <th className={ui.dashTableTh} />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className={cx(ui.dashTableTd, "py-10 text-center text-slate-500")}>
                      Loading…
                    </td>
                  </tr>
                ) : sortedSlots.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={cx(ui.dashTableTd, "py-10 text-center text-slate-500")}>
                      No slots yet. Add one for each class meeting.
                    </td>
                  </tr>
                ) : (
                  sortedSlots.map((s) => (
                    <tr key={s._id} className={ui.dashTableRow}>
                      <td className={ui.dashTableTd}>{DAY_SHORT[String(s.day || "").toLowerCase()] || s.day}</td>
                      <td className={cx(ui.dashTableTd, "font-mono text-xs")}>
                        {s.startTime} – {s.endTime}
                      </td>
                      <td className={ui.dashTableTd}>
                        <span className="font-medium">{s.subject?.name || "—"}</span>
                        {s.subject?.code ? <span className="text-xs text-slate-500"> ({s.subject.code})</span> : null}
                      </td>
                      <td className={ui.dashTableTd}>{s.subject?.faculty?.name || "—"}</td>
                      <td className={ui.dashTableTd}>{s.room || "—"}</td>
                      <td className={cx(ui.dashTableTd, "whitespace-nowrap text-right")}>
                        <button
                          type="button"
                          className="mr-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                          aria-label="Edit"
                          onClick={() => openEdit(s)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          aria-label="Delete"
                          onClick={() => setDeleteId(s._id)}
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
        title={editing ? "Edit slot" : "Add slot"}
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className={cx(ui.btnBase, ui.btnSoft)} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className={cx(ui.btnBase, ui.btnPrimary)}
              disabled={saving || !form.subject}
              onClick={saveSlot}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        }
      >
        <div className="space-y-4 p-5">
          {subjects.length === 0 ? (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              Create at least one subject for this semester before saving a slot. The Save button stays disabled until
              you pick a subject.
            </p>
          ) : null}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Subject</label>
            <select
              className={ui.select}
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              disabled={subjects.length === 0}
            >
              <option value="">Select subject</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.code} — {sub.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Day</label>
            <select
              className={ui.select}
              value={form.day}
              onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
            >
              {DAYS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Start</label>
              <input
                type="time"
                className={ui.input}
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: toHHmm(e.target.value) }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">End</label>
              <input
                type="time"
                className={ui.input}
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: toHHmm(e.target.value) }))}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Room</label>
            <input
              className={ui.input}
              value={form.room}
              onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
              placeholder="e.g. Lab 2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Note (optional)</label>
            <input
              className={ui.input}
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Tutorial, extra lab…"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Remove slot?"
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
        <p className="p-5 text-sm text-slate-600">This removes the period from the master timetable.</p>
      </Modal>
    </div>
  );
}
