import { Bell, UserCircle, LogOut, User, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { cx, ui } from "../../lib/ui";

function sectionLabel(pathname) {
  if (pathname.includes("/adminprofile")) return "Your profile";
  if (pathname.includes("/programs")) return "Programs";
  if (pathname.includes("/semesters")) return "Semesters";
  if (pathname.includes("/attendance")) return "Attendance";
  if (pathname.includes("/timetable")) return "Timetable";
  if (pathname.includes("/results")) return "Results";
  if (pathname.includes("/faculty")) return "Faculty";
  if (pathname.includes("/students")) return "Students";
  return "Admin";
}

export default function AdminHeader({ onOpenSidebar }) {
  const location = useLocation();
  const adminName = useSelector((s) => s.auth.user?.name)?.trim() || "Admin";
  const section = sectionLabel(location.pathname);

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const close = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    };
    if (open) window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    navigate("/admindashboard/adminprofile");
    setOpen(false);
  };

  return (
    <header className={ui.dashHeader}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {onOpenSidebar ? (
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 shadow-sm transition hover:bg-slate-100 md:hidden"
            onClick={onOpenSidebar}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        ) : null}
        <div className="min-w-0">
          <h1 className={ui.dashHeaderTitle}>
            <span className="text-slate-500">{section}</span>
            <span className="mx-1.5 text-slate-300" aria-hidden>
              /
            </span>
            <span className="text-(--brand-blue)">{adminName}</span>
          </h1>
          <p className={ui.dashHeaderMeta}>Manage students and faculty from the sidebar</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3" ref={menuRef}>
        <button
          type="button"
          className="relative rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 transition hover:border-(--brand-blue)/30 hover:text-(--brand-blue)"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" aria-hidden />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-slate-900">
            3
          </span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 shadow-sm transition hover:border-slate-300 sm:pr-3"
          >
            <UserCircle className="h-9 w-9 text-(--brand-blue)" aria-hidden />
            <span className="hidden max-w-[8rem] truncate text-sm font-medium text-slate-800 sm:block">
              {adminName}
            </span>
          </button>

          {open ? (
            <div
              className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
              role="menu"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleProfile}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <User className="h-4 w-4 text-(--brand-blue)" aria-hidden />
                View profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
