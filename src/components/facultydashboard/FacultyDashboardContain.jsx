import React from 'react'
import { CalendarDays, ClipboardCheck, Users, FileText } from "lucide-react";
import { cx, ui } from "../../lib/ui";

function FacultyDashboardContain() {
  return (
    <div className={cx("p-4 sm:p-6", ui.page)}>
      <div className="mb-6">
        <h1 className={ui.h1}>Faculty Dashboard</h1>
        <p className="text-sm text-slate-500">
          Manage today’s classes, attendance, and pending work.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className={cx(ui.card, "p-5")}>
            <div className="flex items-center justify-between">
              <h2 className={ui.h2}>Today’s Schedule</h2>
              <CalendarDays size={18} className="text-slate-500" />
            </div>

            <div className="mt-4 space-y-3">
              <ScheduleRow time="09:00 AM" course="BCA - DS" room="Lab 1" />
              <ScheduleRow time="11:00 AM" course="BCA - DBMS" room="Room 12" />
              <ScheduleRow time="02:00 PM" course="MCA - OS" room="Room 7" />
            </div>
          </div>

          <div className={cx(ui.card, "p-5")}>
            <div className="flex items-center justify-between">
              <h2 className={ui.h2}>Quick Actions</h2>
              <ClipboardCheck size={18} className="text-slate-500" />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button className={cx(ui.btnBase, ui.btnPrimary)}>
                Mark Attendance
              </button>
              <button className={cx(ui.btnBase, ui.btnAccent)}>
                Upload Marks
              </button>
              <button className={cx(ui.btnBase, ui.btnSoft)}>
                Add Assignment
              </button>
              <button className={cx(ui.btnBase, ui.btnSoft)}>
                View Students
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Stat title="Pending Assignments" value="2" icon={<FileText size={18} />} />
          <Stat title="Classes Today" value="3" icon={<CalendarDays size={18} />} />
          <Stat title="Total Students" value="86" icon={<Users size={18} />} />
        </div>
      </div>
    </div>
  )
}

function Stat({ title, value, icon }) {
  return (
    <div className={cx("p-5", ui.card)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
          {icon}
        </div>
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

export default FacultyDashboardContain