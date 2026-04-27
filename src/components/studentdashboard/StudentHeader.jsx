import { Bell, UserCircle, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentHeader = () => {
  const studentName = "Anjali";
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/studentdashboard/profile");
    setOpen(false);
  };

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 flex items-center justify-between border-b border-slate-700 shadow-lg">

      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome, <span className="text-orange-400">{studentName}</span> 👋
        </h1>
        <p className="text-xs text-slate-400">Student Dashboard</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6 relative">

        {/* Notifications */}
        <div className="relative cursor-pointer group">
          <Bell size={22} className="group-hover:text-orange-400 transition" />
          <span className="absolute -top-1 -right-2 bg-orange-400 text-black text-xs px-1.5 rounded-full">
            2
          </span>
        </div>

        {/* Profile */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer bg-slate-800 px-3 py-1.5 rounded-full hover:bg-slate-700 transition"
          >
            <UserCircle size={28} />
            <span className="hidden md:block">{studentName}</span>
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-xl shadow-2xl overflow-hidden z-50">

              <button
                onClick={handleProfile}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-orange-400 transition"
              >
                <User size={18} />
                View Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-500 hover:text-white transition"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default StudentHeader;