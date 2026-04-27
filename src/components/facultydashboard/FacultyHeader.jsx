import { useState } from "react";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FacultyHeader = () => {
  const facultyName = "Dr. Sharma";
  const lastLogin = "08 Apr 2026, 10:30 PM";

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/faculty/profile");
    setOpen(false);
  };

  const handleLogout = () => {
    alert("Logged Out");
  };

  return (
    <header
      className="w-full px-3.5 py-3 flex items-center justify-between shadow-md relative"
      style={{ backgroundColor: "rgb(45, 79, 109)", color: "white" }}
    >
      
      {/* Left Section */}
      <div>
        <h1 className="text-xl font-semibold">
          Welcome,{" "}
          <span style={{ color: "rgb(247, 178, 5)" }}>
            {facultyName}
          </span>{" "}
          👋
        </h1>
        <p className="text-sm opacity-80">
          Last Login: {lastLogin}
        </p>
      </div>

      {/* Right Section */}
      <div className="relative">
        
        {/* Profile */}
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 cursor-pointer"
        >
          {/* Profile Image */}
          <img
            src="https://i.pravatar.cc/40" // dummy image
            alt="profile"
            className="w-10 h-10 rounded-full border-2"
            style={{ borderColor: "rgb(247, 178, 5)" }}
          />

          <span className="hidden md:block">{facultyName}</span>
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-3 w-44 bg-white text-black rounded-lg shadow-lg overflow-hidden">
            
            {/* View Profile */}
            <button
              onClick={handleProfile}
              className="w-full flex items-center gap-2 px-4 py-2 transition"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgb(247, 178, 5)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "white")
              }
            >
              <User size={18} />
              View Profile
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 transition"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgb(247, 178, 5)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "white")
              }
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>
        )}
      </div>
    </header>
  );
};

export default FacultyHeader;