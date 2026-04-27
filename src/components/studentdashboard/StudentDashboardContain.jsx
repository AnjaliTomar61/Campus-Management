import React from 'react'
import { BookOpen, ClipboardCheck, Bell, CalendarDays } from "lucide-react";
import { cx, ui } from "../../lib/ui";

function StudentDashboardContain() {
  return (
    <div className={cx("p-4 sm:p-6", ui.page)}>
      <div className="mb-6">
        <h1 className={ui.h1}>Student Dashboard</h1>
        <p className="text-sm text-slate-500">
          Quick view of your classes, attendance, and latest notices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
              <button className={cx(ui.btnBase, ui.btnPrimary)}>Courses</button>
              <button className={cx(ui.btnBase, ui.btnSoft)}>Results</button>
              <button className={cx(ui.btnBase, ui.btnSoft)}>Timetable</button>
              <button className={cx(ui.btnBase, ui.btnAccent)}>Assignments</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
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
    <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
      {text}
    </li>
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
        <div
          className="h-2 rounded-full bg-(--brand-accent)"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default StudentDashboardContain