import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  BookOpen,
  ClipboardCheck,
  FileText,
  CreditCard,
  Calendar,
  BarChart3,
  LogOut
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/admindashboard", icon: LayoutDashboard },
  { name: "Students", path: "student", icon: Users },
  { name: "Faculty", path: "facultyform", icon: UserCog },
   { name: "Department", path: "department", icon: BarChart3 },
  { name: "Courses", path: "course", icon: BookOpen },
  { name: "Attendance", path: "attendance", icon: ClipboardCheck },
  { name: "Examinations", path: "exams", icon: FileText },
  { name: "Fees", path: "fees", icon: CreditCard },
  { name: "Timetable", path: "timetable", icon: Calendar },
 
];

export default function Sidebar() {
  return (
    <div className="h-screen flex">

      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col p-4 shadow-xl">

        {/* Logo */}
        <h1 className="text-xl font-bold text-orange-400 mb-8 text-center tracking-wide">
          Smart Campus
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
                <span className="font-medium">{item.name}</span>
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