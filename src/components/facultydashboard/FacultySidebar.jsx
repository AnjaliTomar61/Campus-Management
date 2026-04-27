import { BrowserRouter, Routes, Route, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

// ✅ Icon Imports
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Users
} from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

// Sidebar Component
const FacultySidebar = () => {
  const menu = [
    { name: "Dashboard", path: "/facultydashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Profile", path: "/facultydashboard/profile", icon: <FaUserCircle size={20} /> },
    { name: "Courses", path: "/faculty/courses", icon: <BookOpen size={20} /> },
    { name: "Timetable", path: "/faculty/timetable", icon: <CalendarDays size={20} /> },
    { name: "Attendance", path: "/faculty/attendance", icon: <ClipboardCheck size={20} /> },
    { name: "Marks", path: "/faculty/marks", icon: <FileText size={20} /> },
    { name: "Assignments", path: "/faculty/assignments", icon: <FileText size={20} /> },
    { name: "Students", path: "/faculty/students", icon: <Users size={20} /> },
  ];

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-[rgb(45,79,109)] text-white flex flex-col shadow-2xl">
      <div className="p-5 text-xl font-bold border-b border-gray-700">Faculty Panel</div>

      <div className="flex-1 p-3 space-y-2">
        {menu.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition
              ${isActive ? "hover:bg-orange-400" : "hover:bg-orange-400 hover:text-black"}`
            }
            
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>

      <button onClick={logout} className="m-3 p-3 bg-orange-400 text-black rounded flex items-center gap-2 justify-center">
        <FileText size={18} />
        Logout
      </button>
    </div>
  );
};

// Layout
const Layout = () => (
  <div className="flex">
    <FacultySidebar />
    <div className="flex-1 p-5 bg-gray-100 min-h-screen">
      <Outlet />
    </div>
  </div>
);

// Pages
const Dashboard = () => (
  <div>
    <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
    <p>Total Classes Today: 3</p>
    <p>Pending Assignments: 2</p>
  </div>
);

const Profile = () => (
  <div>
    <h1 className="text-xl font-bold">My Profile</h1>
    <p>Name: Anjali</p>
    <p>Email: faculty@mail.com</p>
  </div>
);

const Courses = () => (
  <div>
    <h1 className="text-xl font-bold">My Courses</h1>
    <ul>
      <li>MCA - Data Structures</li>
    </ul>
  </div>
);

const Timetable = () => (
  <div>
    <h1 className="text-xl font-bold">Timetable</h1>
    <p>10:00 - DS Class</p>
  </div>
);

const Attendance = () => {
  const [students, setStudents] = useState([
    { name: "Rahul", present: false },
    { name: "Priya", present: false }
  ]);

  const toggle = (i) => {
    const updated = [...students];
    updated[i].present = !updated[i].present;
    setStudents(updated);
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Attendance</h1>
      {students.map((s, i) => (
        <div key={i} className="flex gap-3">
          <span>{s.name}</span>
          <input type="checkbox" checked={s.present} onChange={() => toggle(i)} />
        </div>
      ))}
    </div>
  );
};

const Marks = () => (
  <div>
    <h1 className="text-xl font-bold">Upload Marks</h1>
    <input className="border p-2" placeholder="Enter Marks" />
  </div>
);

const Assignments = () => (
  <div>
    <h1 className="text-xl font-bold">Assignments</h1>
    <input type="file" />
  </div>
);

const Students = () => (
  <div>
    <h1 className="text-xl font-bold">Students</h1>
    <p>Student List here</p>
  </div>
);

// App
export default FacultySidebar;