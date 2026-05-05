import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import {
  Users,
  GraduationCap,
  LayoutGrid,
  CalendarRange,
  BookOpen,
  ClipboardCheck,
  CalendarDays,
  Award,
  UserCircle,
  LogOut,
} from "lucide-react";
import { DashboardSidebarShell } from "../dashboard/DashboardSidebarShell";
import { cx, ui, dashNavLinkClass } from "../../lib/ui";

/** Absolute paths so NavLink works reliably under React Router v7. */
const menuItems = [
  { name: "Students", path: "/admindashboard/students", icon: Users, description: "Roster & academic records" },
  { name: "Faculty", path: "/admindashboard/faculty", icon: GraduationCap, description: "Register, placement, directory" },
  {
    name: "Programs",
    path: "/admindashboard/programs",
    icon: LayoutGrid,
    description: "Departments & courses (catalog)",
  },
  {
    name: "Semesters",
    path: "/admindashboard/semesters",
    icon: CalendarRange,
    description: "Per-course semester structure",
  },
  {
    name: "Subjects",
    path: "/admindashboard/subjects",
    icon: BookOpen,
    description: "Course + semester subjects (with faculty)",
  },
  {
    name: "Attendance",
    path: "/admindashboard/attendance",
    icon: ClipboardCheck,
    description: "Student & faculty check-ins by week",
  },
  {
    name: "Timetable",
    path: "/admindashboard/timetable",
    icon: CalendarDays,
    description: "Weekly slots per semester",
  },
  {
    name: "Results",
    path: "/admindashboard/results",
    icon: Award,
    description: "Marks & grades by student",
  },
  {
    name: "Profile",
    path: "/admindashboard/adminprofile",
    icon: UserCircle,
    description: "Your admin account",
  },
];

export default function AdminSidebar({ open, onClose }) {
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
      title="Admin"
      subtitle="Campus console"
      navClassName="overflow-x-hidden overflow-y-hidden"
      footer={
        <button
          type="button"
          onClick={handleLogout}
          className={cx(
            ui.btnBase,
            "w-full justify-center border border-white/15 bg-white/5 py-2.5 text-sm text-white hover:border-red-300/40 hover:bg-red-600/90"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden />
          Log out
        </button>
      }
    >
      <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-amber-200/80">Navigation</p>
      <div className="flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                cx(
                  dashNavLinkClass(isActive),
                  "items-start! gap-3 py-3.5 sm:py-3"
                )
              }
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 opacity-95" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-tight">{item.name}</span>
                <span className="mt-0.5 block text-[11px] font-normal leading-snug text-slate-300/95">
                  {item.description}
                </span>
              </span>
            </NavLink>
          );
        })}
      </div>
    </DashboardSidebarShell>
  );
}
