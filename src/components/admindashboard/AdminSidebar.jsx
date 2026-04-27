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
  LogOut,
} from "lucide-react";
import { DashboardSidebarShell } from "../dashboard/DashboardSidebarShell";
import { cx, ui, dashNavLinkClass } from "../../lib/ui";

const menuItems = [
  { name: "Dashboard", path: "/admindashboard", icon: LayoutDashboard, end: true },
  { name: "Students", path: "student", icon: Users },
  { name: "Faculty", path: "facultyform", icon: UserCog },
  { name: "Department", path: "department", icon: BarChart3 },
  { name: "Courses", path: "course", icon: BookOpen },
  { name: "Semesters", path: "semesters", icon: Calendar },
  { name: "Subjects", path: "subjects", icon: FileText },
  { name: "Attendance", path: "attendance", icon: ClipboardCheck },
  { name: "Examinations", path: "exams", icon: FileText },
  { name: "Fees", path: "fees", icon: CreditCard },
  { name: "Timetable", path: "timetable", icon: Calendar },
];

export default function AdminSidebar({ open, onClose }) {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <DashboardSidebarShell
      open={open}
      onClose={onClose}
      title="Smart Campus"
      subtitle="Admin console"
      footer={
        <button
          type="button"
          onClick={logout}
          className={cx(
            ui.btnBase,
            "w-full justify-center border border-white/15 bg-white/5 py-2.5 text-sm text-white hover:border-red-300/40 hover:bg-red-600/90"
          )}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Log out
        </button>
      }
    >
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => onClose?.()}
            className={({ isActive }) => dashNavLinkClass(isActive)}
          >
            <Icon className="h-4.5 w-4.5 shrink-0 opacity-90" aria-hidden />
            <span className="truncate">{item.name}</span>
          </NavLink>
        );
      })}
    </DashboardSidebarShell>
  );
}
