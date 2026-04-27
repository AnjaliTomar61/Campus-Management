import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Users,
  UserCircle,
  LogOut,
} from "lucide-react";
import { DashboardSidebarShell } from "../dashboard/DashboardSidebarShell";
import { cx, ui, dashNavLinkClass } from "../../lib/ui";

const menu = [
  { name: "Dashboard", path: "/facultydashboard", icon: LayoutDashboard, end: true },
  { name: "Profile", path: "/facultydashboard/profile", icon: UserCircle },
  { name: "Courses", path: "/faculty/courses", icon: BookOpen },
  { name: "Timetable", path: "/faculty/timetable", icon: CalendarDays },
  { name: "Attendance", path: "/faculty/attendance", icon: ClipboardCheck },
  { name: "Marks", path: "/faculty/marks", icon: FileText },
  { name: "Assignments", path: "/faculty/assignments", icon: FileText },
  { name: "Students", path: "/faculty/students", icon: Users },
];

export default function FacultySidebar({ open, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const doLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  return (
    <DashboardSidebarShell
      open={open}
      onClose={onClose}
      title="Faculty portal"
      subtitle="SVVV dashboard"
      footer={
        <button
          type="button"
          onClick={doLogout}
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
      {menu.map((item) => {
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
