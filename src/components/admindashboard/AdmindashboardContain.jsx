import { Users, BookOpen, Layers, GraduationCap, Bell, Calendar } from "lucide-react";

export default function AdminDashboardContain() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        
        <Card title="Students" count="1,738" icon={<Users />} color="bg-orange-500" />
        <Card title="Faculty" count="179" icon={<GraduationCap />} color="bg-blue-500" />
        <Card title="Departments" count="12" icon={<Layers />} color="bg-green-500" />
        <Card title="Courses" count="48" icon={<BookOpen />} color="bg-purple-500" />

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">

          {/* ATTENDANCE */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Attendance Overview</h2>

            <div className="space-y-3">
              <Progress label="Present" value="75" color="bg-green-500" />
              <Progress label="Absent" value="25" color="bg-red-400" />
            </div>
          </div>

          {/* RECENT NOTICE */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell size={18} /> Recent Notices
            </h2>

            <ul className="space-y-3">
              <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                📢 Mid-Term Exams will start from 10th May
              </li>
              <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                🎉 Annual Fest Registration Open
              </li>
              <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                📚 Library will remain closed on Sunday
              </li>
            </ul>
          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6">

          {/* EVENTS */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar size={18} /> Upcoming Events
            </h2>

            <div className="space-y-4">
              <Event date="15 July" title="New Student Orientation" />
              <Event date="18 July" title="Science Exhibition" />
              <Event date="27 July" title="Club Registration Close" />
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

            <div className="grid grid-cols-2 gap-3">
              <button className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600">
                Add Student
              </button>
              <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                Add Faculty
              </button>
              <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">
                Add Course
              </button>
              <button className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600">
                Add Notice
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

/* 🔹 CARD COMPONENT */
function Card({ title, count, icon, color }) {
  return (
    <div className={`p-5 rounded-xl text-white shadow ${color} hover:scale-105 transition`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm">{title}</h3>
          <p className="text-2xl font-bold">{count}</p>
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
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