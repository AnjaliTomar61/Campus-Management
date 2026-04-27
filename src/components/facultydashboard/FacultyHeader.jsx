import { useState, useEffect, useRef } from "react";
import { LogOut, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { cx, ui } from "../../lib/ui";

export default function FacultyHeader({ onOpenSidebar }) {
  const authName = useSelector((s) => s.auth.user?.name);
  const facultyName = authName?.trim() || "Faculty";
  const lastLogin = "08 Apr 2026, 10:30 PM";

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

  const handleProfile = () => {
    navigate("/facultydashboard/profile");
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
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
            <span className="text-(--brand-blue)">{facultyName}</span>
          </h1>
          <p className={ui.dashHeaderMeta}>Last login · {lastLogin}</p>
        </div>
      </div>

      <div className="relative shrink-0" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2 shadow-sm transition hover:border-slate-300 sm:pr-2.5"
        >
          <img
            src="https://i.pravatar.cc/40"
            alt=""
            className="h-9 w-9 rounded-full border-2 border-amber-300/80 object-cover"
          />
          <span className="hidden max-w-[9rem] truncate text-sm font-medium text-slate-800 md:block">
            {facultyName}
          </span>
        </button>

        {open ? (
          <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
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
    </header>
  );
}
