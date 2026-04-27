import { useState } from "react";
import { cx, ui } from "../../lib/ui";

export default function AdminAttendance() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const students = [
    {
      id: 1,
      name: "Rahul Sharma",
      enrollment: "ENR001",
      course: "BCA",
      department: "CS",
      gender: "Male",
      attendance: 80,
      records: {
        "2026-04-01": "Present",
        "2026-04-02": "Absent",
      },
    },
    {
      id: 2,
      name: "Anjali Verma",
      enrollment: "ENR002",
      course: "BCA",
      department: "CS",
      gender: "Female",
      attendance: 90,
      records: {
        "2026-04-01": "Present",
        "2026-04-02": "Present",
      },
    },
  ];

  const filteredStudents = students.filter((s) =>
    s.enrollment.toLowerCase().includes(search.toLowerCase())
  );

  const boys = students.filter((s) => s.gender === "Male").length;
  const girls = students.filter((s) => s.gender === "Female").length;

  const totalAttendance =
    students.reduce((acc, s) => acc + s.attendance, 0) / students.length;

  return (
    <div className={cx("p-4 sm:p-6", ui.page)}>

      <div className="mb-6">
        <h1 className={ui.h1}>Attendance Dashboard</h1>
        <p className="text-sm text-slate-500">
          Track overall attendance and view status for a selected date.
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <InfoCard title="Total Students" value={students.length} />
        <InfoCard title="Avg Attendance" value={`${totalAttendance.toFixed(1)}%`} />
        <InfoCard title="Today Date" value={new Date().toLocaleDateString()} />

      </div>

      {/* FILTER + SEARCH */}
      <div className={cx(ui.card, "p-4 mb-6 flex flex-wrap gap-3 items-center")}>

        <input
          type="text"
          placeholder="Search by Enrollment No"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cx(ui.input, "w-full sm:w-72")}
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={cx(ui.input, "w-full sm:w-auto")}
        />

      </div>

      {/* GENDER CHART */}
      <div className={cx(ui.card, "p-5 mb-6")}>
        <h2 className={cx(ui.h2, "mb-4")}>Boys vs Girls</h2>

        <div className="space-y-3">
          <Bar label="Boys" value={boys} total={students.length} color="bg-blue-500" />
          <Bar label="Girls" value={girls} total={students.length} color="bg-pink-500" />
        </div>
      </div>

      {/* STUDENT TABLE */}
      <div className={ui.dashTableCard}>
        <div className={ui.dashTableScroller}>
          <table className={cx(ui.dashTable, "min-w-[860px]")}>
            <thead>
              <tr className={ui.dashTableHead}>
                <th className={ui.dashTableTh}>Name</th>
                <th className={ui.dashTableTh}>Enrollment</th>
                <th className={ui.dashTableTh}>Course</th>
                <th className={ui.dashTableTh}>Dept</th>
                <th className={ui.dashTableTh}>Attendance %</th>
                <th className={ui.dashTableTh}>Status (selected date)</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className={ui.dashTableRow}>
                  <td className={ui.dashTableTd}>{stu.name}</td>
                  <td className={ui.dashTableTd}>{stu.enrollment}</td>
                  <td className={ui.dashTableTd}>{stu.course}</td>
                  <td className={ui.dashTableTd}>{stu.department}</td>
                  <td className={ui.dashTableTd}>
                    <span className="font-semibold">{stu.attendance}%</span>
                  </td>
                  <td className={ui.dashTableTd}>
                    {selectedDate ? stu.records[selectedDate] || "N/A" : "Select date"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* CARD */
function InfoCard({ title, value }) {
  return (
    <div className={cx("p-5 text-center", ui.card)}>
      <h3 className="text-slate-500 text-sm">{title}</h3>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

/* BAR CHART */
function Bar({ label, value, total, color }) {
  const percent = (value / total) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="w-full bg-gray-200 h-3 rounded">
        <div
          className={`${color} h-3 rounded`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}