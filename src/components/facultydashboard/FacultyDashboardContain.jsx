import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ClipboardCheck, Users, BookOpen } from "lucide-react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

function todayDayKey() {
  const d = new Date().getDay();
  const map = { 0: "sun", 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat" };
  return map[d];
}

function formatTime12h(hhmm) {
  if (!hhmm || typeof hhmm !== "string") return "—";
  const [hRaw, mRaw] = hhmm.split(":");
  const h = Number(hRaw);
  const m = Number(mRaw);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return hhmm;
  const period = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

function subjectLabel(slot) {
  const s = slot?.subject;
  if (!s) return "—";
  const name = s.name || "—";
  return s.code ? `${name} (${s.code})` : name;
}

function FacultyDashboardContain() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [timetableHint, setTimetableHint] = useState("");
  const [studentCount, setStudentCount] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ttRes, stRes] = await Promise.all([
        api.get("/api/timetable/me", { meta: { silent: true } }).catch(() => ({ data: {} })),
        api.get("/api/v1/user/faculty/assigned-students", { meta: { silent: true } }).catch(() => ({ data: {} })),
      ]);
      setSlots(Array.isArray(ttRes.data?.slots) ? ttRes.data.slots : []);
      setTimetableHint(typeof ttRes.data?.hint === "string" ? ttRes.data.hint : "");
      const students = stRes.data?.students;
      setStudentCount(Array.isArray(students) ? students.length : 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const day = todayDayKey();
  const todaysSlots = useMemo(() => {
    const list = slots.filter((s) => String(s.day || "").toLowerCase() === day);
    return [...list].sort((a, b) => String(a.startTime || "").localeCompare(String(b.startTime || "")));
  }, [slots, day]);

  const weeklySessionCount = slots.length;

  return (
    <div className={cx("p-4 sm:p-6", ui.page)}>
      <div className="mb-6">
        <h1 className={ui.h1}>Faculty Dashboard</h1>
        <p className="text-sm text-slate-500">
          Manage today’s classes, attendance, and pending work. Data below comes from your assigned subjects and mentees.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className={cx(ui.card, "p-5")}>
            <div className="flex items-center justify-between">
              <h2 className={ui.h2}>Today’s schedule</h2>
              <CalendarDays size={18} className="text-slate-500" aria-hidden />
            </div>

            {timetableHint && todaysSlots.length === 0 && !loading ? (
              <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2 text-sm text-amber-950">
                {timetableHint}
              </p>
            ) : null}

            <div className="mt-4 space-y-3">
              {loading ? (
                <p className="py-6 text-center text-sm text-slate-500">Loading schedule…</p>
              ) : todaysSlots.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  No teaching periods scheduled for you today.
                </p>
              ) : (
                todaysSlots.map((s) => (
                  <ScheduleRow
                    key={s._id}
                    time={`${formatTime12h(s.startTime)} – ${formatTime12h(s.endTime)}`}
                    course={subjectLabel(s)}
                    room={s.room?.trim() || "—"}
                  />
                ))
              )}
            </div>
          </div>

          <div className={cx(ui.card, "p-5")}>
            <div className="flex items-center justify-between">
              <h2 className={ui.h2}>Quick actions</h2>
              <ClipboardCheck size={18} className="text-slate-500" aria-hidden />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                className={cx(ui.btnBase, ui.btnPrimary)}
                onClick={() => navigate("/facultydashboard/attendance")}
              >
                Mark attendance
              </button>
              <button
                type="button"
                className={cx(ui.btnBase, ui.btnAccent)}
                onClick={() => navigate("/facultydashboard/marks")}
              >
                Upload marks
              </button>
              <button
                type="button"
                className={cx(ui.btnBase, ui.btnSoft)}
                onClick={() => navigate("/facultydashboard/assignments")}
              >
                Add assignment
              </button>
              <button
                type="button"
                className={cx(ui.btnBase, ui.btnSoft)}
                onClick={() => navigate("/facultydashboard/assigned-students")}
              >
                View students
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Stat
            title="Weekly teaching slots"
            value={loading ? "…" : String(weeklySessionCount)}
            icon={<BookOpen size={18} />}
            caption="All periods in your timetable this term"
          />
          <Stat
            title="Classes today"
            value={loading ? "…" : String(todaysSlots.length)}
            icon={<CalendarDays size={18} />}
          />
          <Stat title="Assigned students" value={loading ? "…" : String(studentCount)} icon={<Users size={18} />} />
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, icon, caption }) {
  return (
    <div className={cx("p-5", ui.card)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          {caption ? <p className="mt-1 text-xs text-slate-500">{caption}</p> : null}
        </div>
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">{icon}</div>
      </div>
    </div>
  );
}

function ScheduleRow({ time, course, room }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div>
        <p className="text-xs font-medium text-slate-500">{time}</p>
        <p className="text-sm font-semibold text-slate-900">{course}</p>
      </div>
      <p className="text-xs font-semibold text-slate-600">{room}</p>
    </div>
  );
}

export default FacultyDashboardContain;
