import { Users, BookOpen, Layers, GraduationCap, Bell, Calendar } from "lucide-react";
import { cx, ui } from "../../lib/ui";

export default function AdminDashboardContain() {
  return (
    <div className={cx("p-4 sm:p-6", ui.page)}>
      
      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        
        <StatCard title="Students" count="1,738" icon={<Users />} />
        <StatCard title="Faculty" count="179" icon={<GraduationCap />} />
        <StatCard title="Departments" count="12" icon={<Layers />} />
        <StatCard title="Courses" count="48" icon={<BookOpen />} />

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">

          {/* ATTENDANCE */}
          <div className={cx(ui.card, "p-5")}>
            <h2 className={cx(ui.h2, "mb-4")}>Attendance Overview</h2>

            <div className="space-y-3">
              <Progress label="Present" value="75" color="bg-green-500" />
              <Progress label="Absent" value="25" color="bg-red-400" />
            </div>
          </div>

          {/* RECENT NOTICE */}
          <div className={cx(ui.card, "p-5")}>
            <h2 className={cx(ui.h2, "mb-4 flex items-center gap-2")}>
              <Bell size={18} /> Recent Notices
            </h2>

            <ul className="space-y-3">
              <li className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                📢 Mid-Term Exams will start from 10th May
              </li>
              <li className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                🎉 Annual Fest Registration Open
              </li>
              <li className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                📚 Library will remain closed on Sunday
              </li>
            </ul>
          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6">

          {/* EVENTS */}
          <div className={cx(ui.card, "p-5")}>
            <h2 className={cx(ui.h2, "mb-4 flex items-center gap-2")}>
              <Calendar size={18} /> Upcoming Events
            </h2>

            <div className="space-y-4">
              <Event date="15 July" title="New Student Orientation" />
              <Event date="18 July" title="Science Exhibition" />
              <Event date="27 July" title="Club Registration Close" />
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className={cx(ui.card, "p-5")}>
            <h2 className={cx(ui.h2, "mb-4")}>Quick Actions</h2>

            <div className="grid grid-cols-2 gap-3">
              <button className={cx(ui.btnBase, ui.btnAccent, "p-2")}>
                Add Student
              </button>
              <button className={cx(ui.btnBase, ui.btnPrimary, "p-2")}>
                Add Faculty
              </button>
              <button className={cx(ui.btnBase, ui.btnSoft, "p-2")}>
                Add Course
              </button>
              <button className={cx(ui.btnBase, ui.btnSoft, "p-2")}>
                Add Notice
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function StatCard({ title, count, icon }) {
  return (
    <div className={cx("brand-card p-5 rounded-2xl text-white shadow hover:-translate-y-px transition")}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm text-white/80">{title}</h3>
          <p className="text-2xl font-bold">{count}</p>
        </div>
        <div className="text-3xl opacity-90">{icon}</div>
      </div>
    </div>
  );
}

/* 🔹 PROGRESS BAR */
function Progress({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded">
        <div className={`${color} h-2 rounded`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

/* 🔹 EVENT ITEM */
function Event({ date, title }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
      <div className="bg-orange-500 text-white px-2 py-1 rounded text-sm">
        {date}
      </div>
      <p className="text-sm">{title}</p>
    </div>
  );
}