import { useState } from "react";

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
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Attendance Dashboard</h1>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <Card title="Total Students" value={students.length} />
        <Card title="Avg Attendance" value={`${totalAttendance.toFixed(1)}%`} />
        <Card title="Today Date" value={new Date().toLocaleDateString()} />

      </div>

      {/* FILTER + SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-3 items-center">

        <input
          type="text"
          placeholder="Search by Enrollment No"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-60"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />

      </div>

      {/* GENDER CHART */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-4">Boys vs Girls</h2>

        <div className="space-y-3">
          <Bar label="Boys" value={boys} total={students.length} color="bg-blue-500" />
          <Bar label="Girls" value={girls} total={students.length} color="bg-pink-500" />
        </div>
      </div>

      {/* STUDENT TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="p-3">Name</th>
              <th>Enrollment</th>
              <th>Course</th>
              <th>Dept</th>
              <th>Attendance %</th>
              <th>Status (Selected Date)</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((stu) => (
              <tr key={stu.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{stu.name}</td>
                <td>{stu.enrollment}</td>
                <td>{stu.course}</td>
                <td>{stu.department}</td>

                <td>
                  <span className="font-semibold">
                    {stu.attendance}%
                  </span>
                </td>

                <td>
                  {selectedDate
                    ? stu.records[selectedDate] || "N/A"
                    : "Select Date"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* CARD */
function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
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