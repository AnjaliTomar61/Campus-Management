import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  FileText,
  Bell,
  Calendar,
  BarChart3,
  BookMarked,
  LogOut
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/studentdashboard", icon: LayoutDashboard },
  { name: "Courses", path: "courses", icon: BookOpen },
  { name: "Attendance", path: "attendance", icon: ClipboardCheck },
  { name: "Marks", path: "marks", icon: BarChart3 },
  { name: "Assignments", path: "assignments", icon: BookMarked },
  { name: "Results", path: "results", icon: FileText },
  { name: "Notice", path: "notice", icon: Bell },
  { name: "Timetable", path: "timetable", icon: Calendar },
];

export default function StudentSidebar() {
  return (
    <div className="h-screen flex">

      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col p-4 shadow-xl">

        {/* Logo */}
        <h1 className="text-xl font-bold text-orange-400 mb-8 text-center">
          Student Panel
        </h1>

        {/* Menu */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-orange-400 text-black shadow-md scale-[1.02]"
                      : "hover:bg-slate-700 hover:pl-4"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="flex items-center gap-3 p-3 rounded-xl mt-auto hover:bg-red-500 transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </div>

    </div>
  );
}