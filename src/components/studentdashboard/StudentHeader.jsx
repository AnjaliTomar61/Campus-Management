import { Bell, UserCircle, LogOut, User, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { ui } from "../../lib/ui";

export default function StudentHeader({ onOpenSidebar }) {
  const studentName = "Anjali";
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
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    dispatch(logout());
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/studentdashboard/profile");
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
            Welcome,{" "}
            <span className="text-(--brand-blue)">{studentName}</span>
          </h1>
          <p className={ui.dashHeaderMeta}>Student dashboard</p>
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
            2
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
              {studentName}
            </span>
          </button>

          {open ? (
            <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={handleProfile}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <User className="h-4 w-4 text-(--brand-blue)" aria-hidden />
                View profile
              </button>
              <button
                type="button"
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
