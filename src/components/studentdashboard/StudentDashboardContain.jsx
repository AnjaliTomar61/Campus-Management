import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ClipboardCheck, Bell, CalendarDays, UserRound, Mail, Phone, FileText } from "lucide-react";
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

function StudentDashboardContain() {
  const [mentor, setMentor] = useState(null);
  const [academicHint, setAcademicHint] = useState("");
  const [courseLabel, setCourseLabel] = useState("");
  const [slots, setSlots] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [profileRes, timetableRes, attendanceRes, resultRes] = await Promise.all([
          api.get("/api/v1/user/me/profile", {
            meta: { suppressErrorToast: true, silent: true },
          }),
          api.get("/api/timetable/me", { meta: { silent: true } }).catch(() => ({ data: {} })),
          api.get("/api/attendance/me/today", { meta: { silent: true } }).catch(() => ({ data: {} })),
          api.get("/api/results/me", { meta: { silent: true } }).catch(() => ({ data: {} })),
        ]);
        const p = profileRes.data?.profile;
        if (!cancelled) {
          setMentor(p?.assignedFaculty || null);
          const parts = [];
          if (p?.course?.courseName) parts.push(p.course.courseName);
          if (p?.currentSemester?.number != null) parts.push(`Semester ${p.currentSemester.number}`);
          setAcademicHint(parts.length ? parts.join(" · ") : "");
          setCourseLabel(
            p?.course ? `${p.course.courseName || ""}${p.course.courseCode ? ` (${p.course.courseCode})` : ""}`.trim() : ""
          );
          setSlots(Array.isArray(timetableRes.data?.slots) ? timetableRes.data.slots : []);
          setTodayAttendance(attendanceRes.data?.summary || null);
          setResults(Array.isArray(resultRes.data?.results) ? resultRes.data.results : []);
        }
      } catch {
        if (!cancelled) {
          setMentor(null);
          setSlots([]);
          setTodayAttendance(null);
          setResults([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const todayClasses = useMemo(() => {
    const day = todayDayKey();
    return [...slots]
      .filter((s) => String(s.day || "").toLowerCase() === day)
      .sort((a, b) => String(a.startTime || "").localeCompare(String(b.startTime || "")));
  }, [slots]);

  const notices = useMemo(() => {
    const items = [];
    if (courseLabel) items.push(`Course assigned: ${courseLabel}.`);
    if (results.length) items.push(`${results.length} published result sheet(s) are available.`);
    if (todayAttendance?.status === "complete") items.push("Today's attendance is complete.");
    else if (todayAttendance?.status === "in") items.push("You are checked in today. Remember to check out.");
    else items.push("No attendance record for today yet.");
    if (!todayClasses.length) items.push("No classes scheduled for today.");
    return items.slice(0, 3);
  }, [courseLabel, results.length, todayAttendance?.status, todayClasses.length]);

  return (
    <div className={cx("p-4 sm:p-6", ui.page)}>
      <div className="mb-6">
        <h1 className={ui.h1}>Student Dashboard</h1>
        <p className="text-sm text-slate-500">Quick view of your classes, attendance, results, and academic updates.</p>
      </div>

      {mentor ? (
        <div className={cx(ui.card, "mb-6 border-amber-200/80 bg-linear-to-r from-amber-50/90 to-white p-5")}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-900">
                <UserRound className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-900/90">Your faculty mentor</h2>
                <p className="mt-0.5 text-lg font-bold text-slate-900">{mentor.name}</p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-700">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                    <a className="truncate underline-offset-2 hover:underline" href={`mailto:${mentor.email}`}>
                      {mentor.email}
                    </a>
                  </span>
                  {mentor.mobile ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                      <a href={`tel:${mentor.mobile}`}>{mentor.mobile}</a>
                    </span>
                  ) : null}
                </div>
                {academicHint ? <p className="mt-2 text-xs text-slate-600">{academicHint}</p> : null}
              </div>
            </div>
            <Link to="/studentdashboard/profile" className={cx(ui.btnBase, ui.btnSoft, "shrink-0 self-start sm:self-center")}>
              Full profile and academics
            </Link>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className={cx(ui.card, "p-5")}>
            <div className="flex items-center justify-between">
              <h2 className={ui.h2}>Today’s Classes</h2>
              <CalendarDays className="text-slate-500" size={18} />
            </div>

            <div className="mt-4 space-y-3">
              {todayClasses.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">No classes scheduled for today.</p>
              ) : (
                todayClasses.map((slot) => (
                  <ClassRow
                    key={slot._id}
                    time={`${formatTime12h(slot.startTime)} - ${formatTime12h(slot.endTime)}`}
                    title={slot.subject?.name || "Subject"}
                    room={slot.room || "—"}
                  />
                ))
              )}
            </div>
          </div>

          <div className={cx(ui.card, "p-5")}>
            <div className="flex items-center justify-between">
              <h2 className={ui.h2}>Attendance</h2>
              <ClipboardCheck className="text-slate-500" size={18} />
            </div>

            <div className="mt-4 space-y-3">
              <Progress label="Today status" valueLabel={attendanceLabel(todayAttendance?.status)} value={attendancePercent(todayAttendance?.status)} />
              <Progress label="Classes today" valueLabel={`${todayClasses.length}`} value={Math.min(todayClasses.length * 25, 100)} />
            </div>
            <Link
              to="/studentdashboard/attendance"
              className={cx(ui.btnBase, ui.btnPrimary, "mt-4 w-full justify-center text-center")}
            >
              Daily check-in · week view
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className={cx(ui.card, "p-5")}>
            <div className="flex items-center justify-between">
              <h2 className={ui.h2}>Notices</h2>
              <Bell className="text-slate-500" size={18} />
            </div>

            <ul className="mt-4 space-y-3">
              {notices.map((item, idx) => (
                <Notice key={idx} text={item} />
              ))}
            </ul>
          </div>

          <div className={cx(ui.card, "p-5")}>
            <div className="flex items-center justify-between">
              <h2 className={ui.h2}>Quick Links</h2>
              <BookOpen className="text-slate-500" size={18} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link to="/studentdashboard/profile" className={cx(ui.btnBase, ui.btnPrimary, "text-center")}>
                Profile
              </Link>
              <Link to="/studentdashboard/attendance" className={cx(ui.btnBase, ui.btnSoft, "text-center")}>
                Attendance
              </Link>
              <Link to="/studentdashboard/results" className={cx(ui.btnBase, ui.btnSoft, "text-center")}>
                Results
              </Link>
              <Link to="/studentdashboard/timetable" className={cx(ui.btnBase, ui.btnSoft, "text-center")}>
                Timetable
              </Link>
              <Link to="/studentdashboard/marks" className={cx(ui.btnBase, ui.btnAccent, "text-center")}>
                Marks
              </Link>
              <Link to="/studentdashboard/assignments" className={cx(ui.btnBase, ui.btnSoft, "text-center")}>
                Assignments
              </Link>
            </div>
          </div>

          <div className={cx(ui.card, "p-5")}>
            <div className="flex items-center justify-between">
              <h2 className={ui.h2}>Results</h2>
              <FileText className="text-slate-500" size={18} />
            </div>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Published result sheets</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{results.length}</p>
              </div>
              <Link to="/studentdashboard/results" className={cx(ui.btnBase, ui.btnPrimary)}>
                View results
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassRow({ time, title, room }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div>
        <p className="text-xs font-medium text-slate-500">{time}</p>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
      </div>
      <p className="text-xs font-semibold text-slate-600">{room}</p>
    </div>
  );
}

function Notice({ text }) {
  return (
    <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">{text}</li>
  );
}

function Progress({ label, value, valueLabel }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{valueLabel ?? `${value}%`}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-(--brand-accent)" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function attendancePercent(status) {
  if (status === "complete") return 100;
  if (status === "in") return 60;
  return 0;
}

function attendanceLabel(status) {
  if (status === "complete") return "Present";
  if (status === "in") return "Checked in";
  return "No record";
}

export default StudentDashboardContain;
