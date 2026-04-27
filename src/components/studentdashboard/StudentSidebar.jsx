import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  FileText,
  Bell,
  Calendar,
  BarChart3,
  BookMarked,
  LogOut,
  UserCircle,
} from "lucide-react";
import { DashboardSidebarShell } from "../dashboard/DashboardSidebarShell";
import { cx, ui, dashNavLinkClass } from "../../lib/ui";

/** All absolute paths — relative `to` breaks under React Router v7 from nested URLs. */
const menuItems = [
  { name: "Dashboard", path: "/studentdashboard", icon: LayoutDashboard, end: true },
  { name: "Profile", path: "/studentdashboard/profile", icon: UserCircle },
  { name: "Courses", path: "/studentdashboard/courses", icon: BookOpen },
  { name: "Attendance", path: "/studentdashboard/attendance", icon: ClipboardCheck },
  { name: "Marks", path: "/studentdashboard/marks", icon: BarChart3 },
  { name: "Assignments", path: "/studentdashboard/assignments", icon: BookMarked },
  { name: "Results", path: "/studentdashboard/results", icon: FileText },
  { name: "Notice", path: "/studentdashboard/notice", icon: Bell },
  { name: "Timetable", path: "/studentdashboard/timetable", icon: Calendar },
];

export default function StudentSidebar({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <DashboardSidebarShell
      open={open}
      onClose={onClose}
      title="Student portal"
      subtitle="Your campus workspace"
      footer={
        <button
          type="button"
          onClick={handleLogout}
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
