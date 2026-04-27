import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ClipboardCheck, Bell, CalendarDays, UserRound, Mail, Phone } from "lucide-react";
import { api } from "../../lib/apiClient";
import { cx, ui } from "../../lib/ui";

function StudentDashboardContain() {
  const [mentor, setMentor] = useState(null);
  const [academicHint, setAcademicHint] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/v1/user/me/profile", {
          meta: { suppressErrorToast: true, silent: true },
        });
        const p = res.data?.profile;
        if (!cancelled && p?.assignedFaculty) {
          setMentor(p.assignedFaculty);
          const parts = [];
          if (p.course?.courseName) parts.push(p.course.courseName);
          if (p.currentSemester?.number != null) parts.push(`Semester ${p.currentSemester.number}`);
          setAcademicHint(parts.length ? parts.join(" · ") : "");
        }
      } catch {
        if (!cancelled) setMentor(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={cx("p-4 sm:p-6", ui.page)}>
      <div className="mb-6">
        <h1 className={ui.h1}>Student Dashboard</h1>
        <p className="text-sm text-slate-500">Quick view of your classes, attendance, and latest notices.</p>
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
              <ClassRow time="10:00 AM" title="Data Structures" room="Lab 2" />
              <ClassRow time="12:00 PM" title="Operating Systems" room="Room 14" />
              <ClassRow time="02:00 PM" title="DBMS" room="Room 8" />
            </div>
          </div>

          <div className={cx(ui.card, "p-5")}>
            <div className="flex items-center justify-between">
              <h2 className={ui.h2}>Attendance</h2>
              <ClipboardCheck className="text-slate-500" size={18} />
            </div>

            <div className="mt-4 space-y-3">
              <Progress label="Overall" value={82} />
              <Progress label="This Month" value={78} />
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
              <Notice text="Mid-term exam schedule uploaded." />
              <Notice text="Library timings updated for weekends." />
              <Notice text="Fee payment last date: 05 May." />
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
              <button type="button" className={cx(ui.btnBase, ui.btnAccent)}>
                Assignments
              </button>
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

function Progress({ label, value }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-(--brand-accent)" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default StudentDashboardContain;
